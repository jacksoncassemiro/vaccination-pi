"use client";

import { useSyncExternalStore } from "react";

/**
 * Store para cache de dados de formulário.
 * Utiliza useSyncExternalStore para manter dados entre componentes.
 */
class FormCacheStore {
	private cache = new Map<string, unknown>();
	private listeners = new Set<() => void>();

	subscribe = (callback: () => void): (() => void) => {
		this.listeners.add(callback);

		return () => {
			this.listeners.delete(callback);
		};
	};

	getSnapshot = (key: string) => {
		return this.cache.get(key);
	};

	getServerSnapshot = () => {
		return undefined;
	};
	setData = <T>(key: string, data: T): void => {
		this.cache.set(key, data);
		this.notifyListeners();
	};

	clearData = (key: string): void => {
		this.cache.delete(key);
		this.notifyListeners();
	};

	private notifyListeners = (): void => {
		this.listeners.forEach((callback) => callback());
	};
}

const formCacheStore = new FormCacheStore();

/**
 * Hook para cache de dados de formulário usando useSyncExternalStore.
 * Útil para preservar dados entre navegações ou componentes.
 *
 * @param key - Chave única para identificar o cache
 * @returns [data, setData, clearData]
 */
export function useFormCache<T>(
	key: string
): [T | undefined, (data: T) => void, () => void] {
	const data = useSyncExternalStore(
		formCacheStore.subscribe,
		() => formCacheStore.getSnapshot(key) as T | undefined,
		formCacheStore.getServerSnapshot
	);

	const setData = (newData: T) => {
		formCacheStore.setData(key, newData);
	};

	const clearData = () => {
		formCacheStore.clearData(key);
	};

	return [data, setData, clearData];
}
