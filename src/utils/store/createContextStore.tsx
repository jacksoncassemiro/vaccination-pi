import { createStore, type PartialState } from "@/utils/store";
import {
  createContext,
  ReactNode,
  useContext,
  useLayoutEffect,
  useRef,
} from "react";

type StoreInstance<Shape extends object> = ReturnType<
  typeof createStore<Shape>
>;

interface ProviderProps<Shape extends object> {
  initialState?: PartialState<Shape>;
  updateState?: PartialState<Shape>;
  children: ReactNode;
}

const createContextStore = <Shape extends object>(defaultState: Shape) => {
  const Context = createContext<StoreInstance<Shape> | null>(null);

  const ProviderStore = ({
    initialState,
    updateState,
    children,
  }: ProviderProps<Shape>) => {
    const storeRef = useRef<StoreInstance<Shape>>(
      createStore<Shape>(defaultState),
    );

    const mountedRef = useRef<boolean>(false);
    if (initialState !== undefined && !mountedRef.current) {
      storeRef.current.setInitialServerState(initialState);
    }

    useLayoutEffect(() => {
      if (updateState !== undefined && mountedRef.current) {
        storeRef.current.setState(updateState);
      }
      mountedRef.current = true;
    }, [updateState]);

    return <Context value={storeRef.current}>{children}</Context>;
  };

  const useContextStore = (): StoreInstance<Shape> => {
    const store = useContext(Context);
    if (store === null) {
      throw new Error("useContextStore deve ser usado dentro de ProviderStore");
    }

    return store;
  };

  return { ProviderStore, useContextStore };
};

export { createContextStore };
