# Hooxus — State manage tools with react hooks

🤣🤣🤣

Easily using state or reduce hook, considering dependencies management by just — 

## Two functions! 

the main took functions are:

## useProvider

```typescript
const value$ = useProvider(undefined, ""); 
// if there is no other dependencies

const valueFromProps$ = useProvider(props.value$, "")
// if there is dependency from props

const vlaueFromContext$ = useProvider(useContext(Context),"")
// if there is dependency from context
// use in the children components
```

The consequence of this api is:

**Component will look for the state hook in props or context, otherwise using the state hook locally.**

**Once the firs param was undefined, it will create a new state hook.**

And the output of this api function is in this form:

```typescript
{value,setValue}
```

Rather than array form, so you can use it like this:

```html
<span>{value$.value}</span>
<button onClick={()=>value$.setValue('new value')}>functionality</button>
```

That type of methods will keep **robustness** of functional component, you can just develop an independent component, despite there is no other dependencies developed.

> ! Using XXX$ like nomination to specify that this variable is a reactive StateHook

## useStoreProvider

```typescript
// declaration
const store_$ = useStoreProvider(undefined, {
    state: { value: 0 },
    actions: {
      addValue(state, payload: number) {
        return { value: state.value + payload };
      }
    },
    asyncActions: {
      async addValueLater(ctx, payload) {
        await wait(1000);
        ctx.commit("addValue", payload);
      }
    }
  });

// using
store_$.value
store_$.commit('action',1)
store_$.dispatch('async action',1)
```

Inspired by the flux like store management — vuex.

### commit

"Dispatch" an action — in the actions of declaration — that directly change the state.

### dispatch

"Dispatch" an async function — in the asyncActions of declaration — then in that function "dispatch" a direct changing.

> ! You'd better declare a store in other independent file, in case of circular reference.
>
> ! Using XXX_$ like nomination to specify that this variable is a StoreHook

----

Just use that two function with other state transformation function:

`useEffect`，`useMemo`,` useLayoutEffect`

And ref hook：

`useRef`

Can easily change the world!

Never forget to listen the value of provider:

```typescript
useEffect(()=>{
//...
},[value$.value,store_$.value])
```

# 😃 Happy Hacking!

