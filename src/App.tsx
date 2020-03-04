import React from "react";
import { useStoreProvider, useProvider } from "./package";

function wait(t: number) {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, t);
  });
}

function App() {
  const test$ = useProvider(undefined, "");
  const store$ = useStoreProvider(
    undefined,
    {
      state: { value: 1 },
      actions: {
        addValue(state, payload: number) {
          return { ...state, value: state.value + payload };
        }
      },
      asyncActions: {
        async addValue(ctx, payload) {
          await wait(1000);
          ctx.commit("addValue", payload);
        }
      }
    },
    true
  );
  return (
    <div>
      {test$.value}
      {store$.state.value}
      <button
        onClick={() => {
          test$.setValue("fuck");
          store$.dispatch("addValue", 10);
        }}
      >
        test
      </button>
    </div>
  );
}

export default App;
