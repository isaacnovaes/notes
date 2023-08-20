# React doc notes

## Components

- React components are JS functions that return JSX
- React components start with uppercase letter, whereas HTML tags start with lowercase letter
- Never nest component definitions. When a component rerender, the components that are defined inside of it will unmount and remount and have their state recreated

## JSX

- JSX looks like HTML, but under the hood it is transformed into plain JavaScript objects.
- You can’t return two objects from a function without wrapping them into an array.
  - This explains why you also can’t return two JSX tags without wrapping them into another tag or a Fragment
- Since class is a reserved word, in React you write className instead

- You can specify a default prop value like size = 100, which is used for missing and undefined props.

  - null and zero are not missing prop

- React considers false as a “hole” in the JSX tree, just like null or undefined, and doesn’t render anything in its place.
  - So only use JS logical AND operator (&&) when the left side is a boolean, null, or undefined
  - Don't put numbers on the left side
- React component names must start with a capital letter, like StatusBar and SaveButton.
- React components also need to return something that React knows how to display, like a piece of JSX.
- Hook names must start with use followed by a capital letter, like useState (built-in) or useOnlineStatus

### JSX Keys

Keys let React uniquely identify an item between its siblings

Do not generate keys on the fly, e.g. with key={Math.random()}.
This will cause keys to never match up between renders, leading to all your components and DOM being recreated every time

### KEEP COMPONENTS PURE

## Events

All events propagate (bubble up) in React except onScroll, which only works on the JSX tag you attach it to.
Don’t confuse e.stopPropagation() and e.preventDefault(). They are both useful, but are unrelated:

- e.stopPropagation() stops the event handlers attached to the tags above from firing.
- e.preventDefault() prevents the default browser behavior for the few events that have it.
  - Explicitly calling an event handler prop from a child handler is a good alternative to propagation:

## Render process (3 steps)

Render oly mean to recall the functions that defines the component
However, the render may contain expensive functions that delay the render process
What really changes the screen is the commit phase of the render process

- step 1: trigger (fist render or component or its ancestor state update)
- step 2: render (react calls the component - the function that defines the component line by line)
  - for first render, react calls the root component
  - for subsequent renders, react calls the function component whose state update triggered the render
  - During the initial render, React will create the DOM nodes for section, h1, and three img tags.
  - During a re-render, React will calculate which of their properties, if any, have changed since the previous render.
  - It won’t do anything with that information until the next step, the commit phase.
- step 3: commit changes to the DOM
  - After rendering (calling) your components, React will modify the DOM.
  - For the initial render, React will use the appendChild() DOM API to put all the DOM nodes it has created on screen.
  - For re-renders, React will apply the minimal necessary operations (calculated while rendering!) to make the DOM match the latest rendering output.
  - React only changes the DOM nodes if there’s a difference between renders.

## React state batching

React processes state updates after event handlers have finished running. This is called batching.

React batches state updates even from different components together

## useState hook

const [todos, setTodos] = useState(createInitialTodos());
Although the result of createInitialTodos() is only used for the initial render, you’re still calling this function on every render.

This can be wasteful if it’s creating large arrays or performing expensive calculations.

To solve this, you may pass it as an initializer function to useState instead:
const [todos, setTodos] = useState(createInitialTodos);

In a set function, if the new value you provide is identical to the current state, as determined by an `Object.is comparison`, React will `skip re-rendering` the component and its children

In Strict Mode, React will call your updater function twice in order to help you find accidental impurities.

### Calling useState many times

`react makes a queue of each setState`. then it calls one by one following the queue.
Then the state that is gonna be used in the next render is the last state value from this queue

    setState(state + k)  => replaces what is in the queue by state + k, ignoring what's already queued
    setState(k)          => replaces what is in the queue by k, ignoring what's already queued
    setState(n => n + k) => take the state value in the queue and returns it plus k

In Strict Mode, React will run each updater function twice (but discard the second result) to help you find mistakes

### State updater function naming conventions

repeat state name: setState(showDropdown => !showDropDown)

use first letters of state: setState(sd => !sd)

use state name with prefix 'prev': setState(prevShowDropdown => !prevShowDropdown )

### dos and donts

- If some two state variables always change together, it might be a good idea to unify them into a single state variable. Then you won’t forget to always keep them in sync
- Avoid deeply nested state. Prefer normalized state!
- Avoid prop mirroring.
  - Don’t put props into initial state value unless you specifically want to prevent updates when the parent passes in a different prop value.

```js
function Message({ initialColor }) {
// The `color` state variable holds the _first_ value of `initialColor`.
// Further changes to the `initialColor` prop are ignored.
const [color, setColor] = useState(initialColor);
...
}
```

- When you see that you need to use Array.prototype.includes, check if you can substitute it by Set
  - Set.has(), on average, is faster than Array.prototype.includes
  - For example, for holding the ids of the items that are selected

### It’s useful to consider components as “controlled” (driven by props) or “uncontrolled” (driven by state)

### When a component loses state

When a component unmounts, when a component is removed from the UI tree, it loses its state (react destroys it)

It resets the state of its entire subtree of the unmounted component as well!

`This is why you should not nest component function definitions`

React preserves a component’s state for as long as it’s being rendered at the same position in the UI tree.
React also preservers a component's state matching to its assigned key, regardless of the component position in the UI tree (JSX)
it’s the position in the UI tree — not in the JSX markup — that matters to React!

```jsx
{
	isFancy ? <Counter isFancy={true} /> : <Counter isFancy={false} />;
}
// counter is always rendered on the same position, so it doesn't lose its state
```

```jsx
  const Comp = () => {
    	if(...) {
    		return <div><Counter isFancy={true}/> .... </div>
    	}
    	...
    	return <div><Counter isFancy={false... </div>
    }
}
```

`To reset state either render in a different position or give each component a different key`

```jsx
<div>
	{showA && <Counter person='isaac' />}
	{showB && <Counter person='Isabel' />}
</div>;

// OR

{
	isFancy ? (
		<Counter isFancy={true} key='isabel' />
	) : (
		<Counter isFancy={false} key='isaac' />
	);
}
```

`how to keep state of removed components? lift state up or any other storage, like localStorage`

## useReducer

Reducers must be pure.

Similar to state updater functions, reducers run during rendering! (Actions are queued until the next render.) This means that reducers must be pure—same inputs always result in the same output.

They should not send requests, schedule timeouts, or perform any side effects (operations that impact things outside the component).

They should update objects and arrays without mutations.

## useContext

The component will use the value of the nearest <Context.Provider value={value}> in the UI tree above it.

`If the Provider doesn't provide a value, the provided value will be the default (createContext(value))`

### Alternatives

- Extract components and pass JSX as children props to them.
- If you pass some data through many layers of intermediate components that don’t use that data (and only pass it further down), this often means that you forgot to extract some components along the way.
  - For example, maybe you pass data props like posts to visual components that don’t use them directly, like <Layout posts={posts} />.
  - Instead render <Layout><Posts posts={posts} /></Layout>.
  - This reduces the number of layers between the component specifying the data and the one that needs it.

### Before you use context, try passing props or passing JSX as children

## useRef

When you want a component to “remember” some information, but you don’t want that information to trigger new renders, you can use a ref

- You shouldn’t read (or write) the current value during rendering.
- Don’t read or write ref.current during rendering.
  - If some information is needed during rendering, use state instead. Since React doesn’t know when ref.current changes, even reading it while rendering makes your component’s behavior difficult to predict

### Limitations of React state don’t apply to refs

For example, state acts like a snapshot for every render and doesn’t update synchronously.

But when you mutate the current value of a ref, it changes immediately

In Strict Mode, React will call your component function twice in order to help you find accidental impurities. This is development-only behavior and does not affect production. Each ref object will be created twice, but one of the versions will be discarded

Don't place ref.current in your components, because it doesn't synch with the ref.current mutations without an state. Use an state instead. It makes your component pure!

`Only read or write refs inside parts that can be impure, like event handlers or effects`

`Use flushSync to ensure useState is updated synchronously`

## useState and useRef return stable identity values (can be safely used in dependency arrays)

## useEffect

When Strict Mode is on, React remounts every component once after mount (state and DOM are preserved).

This helps you find Effects that need cleanup and exposes bugs like race conditions early.

Additionally, React will remount the Effects whenever you save a file in development. Both of these behaviors are development-only.

In addition to ignoring the result of an outdated API call, you can also use AbortController to cancel the requests that are no longer needed.

However, by itself this is not enough to protect against race conditions. More asynchronous steps could be chained after the fetch, so using `an explicit flag` like ignore is the most reliable way to fix this type of problems.

Common side effects: browser APIs (focus(), play(), scrollIntoView(), DOM manipulation, subscribing to events like scroll etc.), third-party widgets, network.

Effects let you specify side effects that are caused by rendering itself (when component shows up on the screen), rather than by a particular event (like onClick, onScroll)

`Use Effects only for code that should run because the component was displayed to the user.`

Some Effects need to specify how to stop, undo, or clean up whatever they were doing. For example, “connect” needs “disconnect”, “subscribe” needs “unsubscribe”, and “fetch” needs either “cancel” or “ignore”

`If you don’t want some code to re-run, edit the Effect code itself not to “need” that dependency.`

React will call your cleanup function each time before the Effect runs again, and one final time when the component unmounts

### You don’t need Effects

- You don’t need Effects to transform data for rendering, like filtering a list, taking the selected item.
- You don’t need Effects to handle user events
  - Avoid: redundant state and unnecessary Effect
- When something can be calculated from the existing props or state, don’t put it in state. Instead, calculate it during rendering
  - This makes your code faster (you avoid the extra “cascading” updates), simpler (you remove some code), and less error-prone (you avoid bugs caused by different state variables getting out of sync with each other)
- Avoid: Resetting state on prop change in an Effect
  - Split your component in two and pass a key attribute from the outer component to the inner one
  - The component's state and any other state below (children) will reset on key change automatically
- Avoid: Adjusting state on prop change in an Effect
  - Instead, adjust the state directly during rendering

```jsx
function List({ items }) {
	const [isReverse, setIsReverse] = useState(false);
	const [selection, setSelection] = useState(null);

	// Better: Adjust the state while rendering
	const [prevItems, setPrevItems] = useState(items);
	if (items !== prevItems) {
		setPrevItems(items);
		setSelection(null);
	}
	// ...
}
```

Storing information from previous renders like this can be hard to understand, but it’s better than updating the same state in an Effect.

In the above example, setSelection is called directly during a render.

React will re-render the List immediately after it exits with a return statement.

React has not rendered the List children or updated the DOM yet, so this lets the List children skip rendering the stale selection value

When you update a component during rendering, React throws away the returned JSX and immediately retries rendering

Although this pattern is more efficient than an Effect, most components shouldn’t need it either

No matter how you do it, adjusting state based on props or other state makes your data flow more difficult to understand and debug.

Always check whether you can reset all state with a key or calculate everything during rendering instead

For example, instead of storing (and resetting) the selected item, you can store the selected item ID

```jsx
const [selectedId, setSelectedId] = useState(null);
// ✅ Best: Calculate everything during rendering
const selection = items.find(item => item.id === selectedId) ?? null;
```

- Avoid: Event-specific logic inside an Effect
- Avoid: notifying parent component about state changes from events
  - Instead, perform it on the event handler
  - With this approach, both the component and its parent component update their state during the event.
  - React batches updates from different components together, so there will only be one render pass
  - You might also be able to remove the state altogether, and instead receive the state setting function from the parent component. Like lifting the state up
- Avoid: Passing data to the parent in an Effect

`Whenever you try to keep two different state variables synchronized, try lifting state up instead!`

When you’re not sure whether some code should be in an Effect or in an event handler, ask yourself why this code needs to run. `Use Effects only for code that should run because the component was displayed to the user`

If this logic is caused by a particular interaction, keep it in the event handler. If it’s caused by the user seeing the component on the screen, keep it in the Effect

`The fewer raw useEffect calls you have in your components, the easier you will find to maintain your application`

keep the data flow predictable: the data flows down from the parent to the child

Resist adding unrelated logic to your Effect only because this logic needs to run at the same time as an Effect you already wrote
Each Effect in your code should represent a separate and independent synchronization process
you should think whether the processes are same or separate, not whether the code looks cleaner

Effects are not a tool for code reuse.
Instead, to reduce repetition, you can extract some logic into a custom Hook
Ideally, most Effects in your application should eventually be replaced by custom Hooks

All values inside the component (including props, state, and variables in your component’s body) are reactive.

Any reactive value can change on a re-render, so you need to include reactive values as Effect’s dependencies

A mutable value like ref.current or things you read from it also can’t be a dependency. The ref object returned by useRef itself can be a dependency, but its current property is intentionally mutable.

It lets you keep track of something without triggering a re-render. But since changing it doesn’t trigger a re-render, it’s not a reactive value, and React won’t know to re-run your Effect when it changes

`Check that your Effect represents an independent synchronization process`

`If your Effect doesn’t synchronize anything, it might be unnecessary. If it synchronizes several independent things, split it up.`

`Avoid relying on objects and functions as dependencies.`

If you create objects and functions during rendering and then read them from an Effect, they will be different on every render.
This will cause your Effect to re-synchronize every time

### Effect writing good practice

- define how to sync and how to stop sync
- leave Effect dependency empty [], the linter will suggest the correct dependencies
- Are you reading some state to calculate the next state?
  - either calculate it during render or use an updater function
- When you read some state only to calculate the next state, you can remove that dependency by passing an updater function instead
- to remove a dependency, prove that it's not a dependency
- Does it make sense for the Effect to re-run when any of these dependencies change?
- To change the dependencies, change the code or how your reactive values are declared
- `Treat the dependency lint error as a compilation error`. If you don’t suppress it, you will never see bugs that are hard to find
- Object and function dependencies can make your Effect re-synchronize more often than you need.
  - This is why, whenever possible, you should try to avoid objects and functions as your Effect’s dependencies.
  - Instead, try moving them outside the component, inside the Effect, or extracting primitive values out of them. in last case, you can try to memoize it

### useEffectEvent(future)

useEffectEvent solve the problem where the linter does't agree with you

like, when you have a reactive value inside your Effect, but this Effect should not re-sync when this reactive value changes

in other words, this reactive value/func/whatever is an Effect event, so it should belong to the non-sync part of the Effect, so it doesn't mess up with the dependency array

## Pay attention

- Try to keep useEffects inside custom Hooks
- Keep your custom Hooks focused on concrete high-level use cases
- Start by choosing your custom Hook’s name.
- `If you struggle to pick a clear name, it might mean that your Effect is too coupled to the rest of your component’s logic, and is not yet ready to be extracted`
- `If your custom Hook API doesn’t constrain the use cases and is very abstract, in the long run it’s likely to introduce more problems than it solves`

## useMemo

### Is memoization needed?

- If the overall logged time adds up to a significant amount (say, 1ms or more), it might make sense to memoize that calculation

- As an experiment, you can then wrap the calculation in useMemo to verify whether the total logged time has decreased for that interaction or not

- Keep in mind that your machine is probably faster than your users’ so it’s a good idea to test the performance with an artificial slowdown. For example, Chrome offers a CPU Throttling option for this

### Children as JSX plus trick

In practice, you can make a lot of memoization unnecessary by following a few principles:

- When a component visually wraps other components, let it accept JSX as children.
  - Then, if the wrapper component updates its own state, React knows that its children don’t need to re-render.
- `Fun, subtle trick about the children prop, in the case of the parent of the wrapper component uses memo API`

`The children prop act just like another object being passed down as props`

`In the context of performance/memoization, if it's needed, memoize the children prop passed to the wrapper, or the memoization will break`

```tsx
const Wrapper = ({children}) => {
  const [isOpen,setIsOpen] = useState(true) 
  // when the state changes, the children don’t render
    return <div>{children}</div>
}
```

```tsx
const WrapperMemo = memo(<Child/>)
const ChildMemo = memo(<Child/>)
// syntax sugar for
// const child = React.createElement(MemoChild,props,children)
// which returns an object representing a DOM tree
// const child = {
//      type: MemoChild,
//      props: {...},
//      ... internal stuff 
// }
// the reference to this object is not memoized
// so it will make the WrapperMemo to rerender, because the children prop changes on every rerender, just like som={[1,2,3]}
// <WrapperMemo children={{unmemoized ChildMemo reference}}>

const Parent = () => {
 	const [isOpen,setIsOpen] = useState(true) 
// when the state changes, Wrap and Child rerender, even through Child uses memo
 	return <WrapperMemo><ChildMemo/></WrapperMemo>
}
```
// TODO continue from here

---

    	<Wrapper someProp={{name:'isaac'}}></Wrapper>
    	<Wrapper><Child/></Wrapper> = <Wrapper children={<Child/>}/> (syntactic sugar)
    	<Wrapper><div><p>Hello</p></div></Wrapper> = <Wrapper children={<div><p>Hello</p></div>}/> (syntactic sugar)
    	// here, the children prop will be recreated on each re-render, just like {name:'isaac'} passed down as props

    	In the context of performance/memoization, to fix this issue:
    	const child = useMemo(()=><Child/> ,[]) // use Child as a memoized value in the Parent component
    	<Wrapper>{child}</Wrapper>

2 - Prefer local state and don’t lift state up any further than necessary. Don’t keep transient state like forms and whether an item is hovered at the top of your tree or in a global state library.
3 - Keep your rendering logic pure. If re-rendering a component causes a problem or produces some noticeable visual artifact, it’s a bug in your component! Fix the bug instead of adding memoization.
4 - Avoid unnecessary Effects that update state. Most performance problems in React apps are caused by chains of updates originating from Effects that cause your components to render over and over.
5 - Try to remove unnecessary dependencies from your Effects. For example, instead of memoization, it’s often simpler to move some object or a function inside an Effect or outside the component.

If a specific interaction still feels laggy, use the React Developer Tools profiler to see which components benefit the most from memoization, and add memoization where needed

You can debug array-dependency problems by manually logging your dependencies to the console

console.log([productId, referrer]);

You can then right-click on the arrays from different re-renders in the console and select “Store as a global variable” for both of them. Assuming the first one got saved as temp1 and the second one got saved as temp2, you can then use the browser console to check whether each dependency in both arrays is the same:

Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...

When you find which dependency is breaking memoization, either find a way to remove it, or memoize it as well

useCallback
usage
in combination when passing a function as props to a child component which uses 'memo' API
when a function is used as a dependency for another hook, like custom hook or useEffect
Not all memoization is effective: a single value that’s “always new (changes reference)” is enough to break memoization for an entire component
You’ll usually want memoized functions to have as few dependencies as possible
When you read some state only to calculate the next state, you can remove that dependency by passing an updater function instead
If you’re writing a custom Hook, it’s recommended to wrap any functions that it returns into useCallback
This ensures that the consumers of your Hook can optimize their own code when needed

useMemo
Manually wrapping JSX nodes into useMemo is not convenient. For example, you can’t do this conditionally

memo API
reference: memo(Component, arePropsEqual?)
optional arePropsEqual: A function that accepts two arguments: the component’s previous props, and its new props.
It should return true if the old and new props are equal: that is, if the component will render the same output and behave in the same way with the new props as with the old.
Otherwise it should return false. Usually, you will not specify this function. By default, React will compare each prop with Object.is
Even with memo, your component will re-render if its own state changes or if a context that it’s using changes
Memoization only has to do with props that are passed to the component from its parent
To make your component re-render only when a part of some context changes, split your component in two. Read what you need from the context in the outer component, and pass it down to a memoized child as a prop
When you use memo, your component re-renders whenever any prop is not shallowly equal to what it was previously
A better way to minimize props changes is to make sure the component accepts the minimum necessary information in its props
If you provide a custom arePropsEqual implementation, you must compare every prop, including functions.
Functions often close over the props and state of parent components.
If you return true when oldProps.onClick !== newProps.onClick, your component will keep “seeing” the props and state from a previous render inside its onClick handler, leading to very confusing bugs

useLayoutEffect
Call useLayoutEffect perform the layout measurements before the browser repaints the screen, like position, size
It avoids initial flickering, like when rendering the component with wrong data
With useEffect, you render the component with the wrong data, then on the useEffect, you render the component again with the correct data
Use it wisely, because it can hurt Performance, because it delays the browser display
React updates the DOM, you make the necessary data manipulation, then the browser finally displays the component
