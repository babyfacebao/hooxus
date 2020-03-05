import React from "react";
import { useProvider, useStoreProvider, Store } from "hooxus";

function wait(t: number) {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, t);
  });
}

const store: Store<any> = {
  state: { value: 0 },
  actions: {
    add(state, payload) {
      return { value: state.value + payload };
    }
  },
  asyncActions: {
    async addLater(ctx, payload) {
      await wait(1000);
      ctx.commit("add", payload);
    }
  }
};
console.log(store);

function App() {
  const value$ = useProvider(undefined, "", true);
  const store_$ = useStoreProvider(undefined, store,true);

  return (
    <div>
      {value$.value}
      <button onClick={() => value$.setValue(value$.value + "ok ")}>
        add ok
      </button>
      {store_$.state.value}
      <button onClick={() => store_$.dispatch("addLater", 1)}>add one</button>
    </div>
  );
}
export default App;
