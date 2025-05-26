import { useLayoutEffect, useSyncExternalStore } from "react";
import { deepMerge } from "@/utils/deepMerge";
import { DeepPartial } from "@/types/Utils";

type Subscriber = () => void;
type Unsubscribe = () => void;
type PartialState<Shape> =
	| DeepPartial<Shape>
	| ((prev: Shape) => DeepPartial<Shape>);

const createStore = <Shape extends object>(initialState: Shape) => {
	let state = initialState;
	let serverSnapshot: Shape | undefined;
	let hasInitialized = false;
	const listeners = new Set<Subscriber>();

	const getState = (): Shape => state;
	const getServerSnapshot = (): Shape => serverSnapshot ?? initialState;

	const subscribe = (listener: Subscriber): Unsubscribe => {
		listeners.add(listener);
		return () => listeners.delete(listener);
	};

	const applyPartial = (prev: Shape, partial: PartialState<Shape>): Shape => {
		const patch = typeof partial === "function" ? partial(prev) : partial;
		return deepMerge(prev, patch) as Shape;
	};

	const setState = (partial: PartialState<Shape>): void => {
		const next = applyPartial(state, partial);

		if (next !== state) {
			state = next;
			listeners.forEach((listener) => listener());
		}
	};

	const setInitialServerState = (snapshot: PartialState<Shape>): void => {
		if (!hasInitialized) {
			const next = applyPartial(state, snapshot);
			state = next;
			serverSnapshot = next;
			hasInitialized = true;
		}
	};

	const useSelector = <SelectorOutput>(
		selector: (state: Shape) => SelectorOutput
	): SelectorOutput => {
		const selected = useSyncExternalStore(
			subscribe,
			() => selector(state),
			() => selector(getServerSnapshot())
		);

		useLayoutEffect(() => {
			serverSnapshot = undefined;
		}, []);

		return selected;
	};

	return {
		getState,
		setState,
		getServerSnapshot,
		setInitialServerState,
		useSelector,
	};
};

export { createStore, type PartialState };
