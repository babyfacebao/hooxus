import { useState, Dispatch, SetStateAction, Reducer, useReducer } from "react";

export type ActionDispatch = (type: string, payload?: any) => void;

export type AsyncActionDispatch = (
  type: string,
  payload?: any
) => Promise<void>;

export type StateHook<T> = { value: T; setValue: Dispatch<SetStateAction<T>> };

export type StoreHook<T> = {
  state: T;
  commit: ActionDispatch;
  dispatch: AsyncActionDispatch;
};

/**
 * containing state,actions,asyncActions to handle state change
 *
 * @export
 * @interface Store
 * @template T
 */
export interface Store<T> {
  state: T;
  actions: { [type: string]: (state: T, payload: any) => T };
  asyncActions?: {
    [type: string]: (
      ctx: {
        state: T;
        commit: ActionDispatch;
      },
      payload: any
    ) => Promise<any>;
  };
}

/**
 * vuex like store management
 *
 * @export
 * @template T
 * @param {Store<T>} store
 * @returns {state,commit,dispatch}
 */
export function useStore<T>(store: Store<T>, log = false): StoreHook<T> {
  const { state, actions, asyncActions } = store;

  const reducer: Reducer<T, { commitType: string; payload: any }> = (
    state,
    action
  ) => {
    const { commitType, payload } = action;

    const getAction = actions?.[commitType];
    if (!getAction) {
      console.error(`action ${commitType} not founded`);
      return state;
    }

    if (log) {
      console.log(`commit action: ${commitType} at ${new Date()}`);
      console.log("---------");
      console.dir(state);
      console.log("to:");
    }

    const newState = getAction?.(state, payload) || state;

    if (log) {
      console.dir(newState);
      console.log("----------");
    }

    // TODO: add deepClone difference to handle object change
    return newState;
  };

  // original useReducer
  const [_state, _dispatch] = useReducer(reducer, state);

  // vuex style of action commit
  const commit: ActionDispatch = (type, payload = null) => {
    _dispatch({ commitType: type, payload });
  };

  // vuex style of asynchronous action dispatch
  const dispatch: AsyncActionDispatch = async (type, payload = null) => {
    const getAsyncAction = asyncActions?.[type];
    if (!getAsyncAction) {
      console.error(`async action ${type} not founded`);
      return;
    }

    if (log) {
      console.log(`dispatch async action: ${type} at ${new Date()}`);
    }
    return await getAsyncAction?.({ state: _state, commit }, payload);
  };

  return { state: _state, commit, dispatch };
}

/**
 * useState in object form
 *
 * @export
 * @template T
 * @param {T} defaultValue
 * @returns
 */
export function useToken<T>(defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  return { value, setValue };
}

/**
 * define a stateHook whether or not the provider:StateHook provided
 *
 * @export
 * @template T
 * @param {StateHook<T>} provider$
 * @param {T} defaultValue
 * @returns
 */
export function useProvider<T>(
  provider$: StateHook<T> | undefined,
  defaultValue: T
): StateHook<T> {
  const local$ = useState<T>(defaultValue);
  const [value, setValue] = local$;
  return provider$ || { value, setValue };
}

/**
 * define a storeHook whether or not the provider:storeHook provided
 *
 * @export
 * @template T
 * @param {StoreHook<T>} provider$
 * @param {Store<T>} initStore
 * @returns {StoreHook<T>}
 */
export function useStoreProvider<T>(
  provider$: StoreHook<T> | undefined,
  initStore: Store<T>,
  log = false
): StoreHook<T> {
  const local$ = useStore(initStore,log);
  return provider$ || local$;
}
