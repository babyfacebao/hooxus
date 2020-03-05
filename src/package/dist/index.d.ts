import { Dispatch, SetStateAction } from "react";
export declare type ActionDispatch = (type: string, payload?: any) => void;
export declare type AsyncActionDispatch = (type: string, payload?: any) => Promise<void>;
export declare type StateHook<T> = {
    value: T;
    setValue: Dispatch<SetStateAction<T>>;
};
export declare type StoreHook<T> = {
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
    actions: {
        [type: string]: (state: T, payload: any) => T;
    };
    asyncActions?: {
        [type: string]: (ctx: {
            state: T;
            commit: ActionDispatch;
        }, payload: any) => Promise<any>;
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
export declare function useStore<T>(store: Store<T>, log?: boolean): StoreHook<T>;
/**
 * useState in object form
 *
 * @export
 * @template T
 * @param {T} defaultValue
 * @returns
 */
export declare function useToken<T>(defaultValue: T): {
    value: T;
    setValue: Dispatch<SetStateAction<T>>;
};
/**
 * define a stateHook whether or not the provider:StateHook provided
 *
 * @export
 * @template T
 * @param {StateHook<T>} provider$
 * @param {T} defaultValue
 * @returns
 */
export declare function useProvider<T>(provider$: StateHook<T> | undefined, defaultValue: T, log?: boolean): StateHook<T>;
/**
 * define a storeHook whether or not the provider:storeHook provided
 *
 * @export
 * @template T
 * @param {StoreHook<T>} provider$
 * @param {Store<T>} initStore
 * @returns {StoreHook<T>}
 */
export declare function useStoreProvider<T>(provider$: StoreHook<T> | undefined, initStore: Store<T>, log?: boolean): StoreHook<T>;
