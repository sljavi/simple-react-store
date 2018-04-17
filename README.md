[![Build Status](https://travis-ci.org/sljavi/simple-react-store.svg?branch=master)](https://travis-ci.org/sljavi/simple-react-store) [![Coverage Status](https://coveralls.io/repos/github/sljavi/simple-react-store/badge.svg?branch=master)](https://coveralls.io/github/sljavi/simple-react-store?branch=master)

# Simple React Store

A simplified redux store for react

## Install

```
npm install --save simple-react-store
```

## Differences with Redux
Simple React Store is a simplified version of Redux

|Features |Simple React Store |Redux |
|-|-|-|
|Data Flow| <img src="http://javierperez.com.ar/simple-react-store.svg" alt="Drawing" height="400"/>| <img src="http://javierperez.com.ar/redux.svg" alt="Drawing" height="400"/>|
|Store: Single source of true |✅|✅|
|Unidirectional data flow |✅|✅|
|Read the state |✅|✅|
|State updates |Directly setting the new state | Via reducers and actions|
|Action Dispatching | No needed| Required|
|Action Types | Optional when updating state | Required |
|Reducers | No needed| Required |
|Async Actions | Using plain simple js calls | Using some library (i.e. redux-thunk)|
|State change subscriptions |✅|✅|
|Connect React components with the store|Unified map to props callback|Map state and map dispatch to props callbacks |
|Redux Dev Tool Integration|Built in|Using a middleware|
|Middlewares |❌|✅|
||![enter image description here](http://javierperez.com.ar/3legs.jpg)| ![](http://javierperez.com.ar/4legs.jpg) |

## Usage

### Create a Store
#### new Store(initialState)
Returns a new Store with the initial state set. If the initial state is not provided defaults to an empty object

##### Arguments

`initialState (any)[{}]`: The initial state you want to set. Defaults to empty object.


##### Returns

`(Store instance)`: A new Store with the initial state set

##### Example

```javascript
import { Store } from 'simple-react-store'

// Create store with empty state
const aStore = new Store()

// Create store with initial state
const anotherStore = new Store({
  name: 'John Doe',
  user: 'john.dow'
})
```

### Get state
#### aStore.getState()
Returns the saved state

##### Returns
`(any)`: The previously saved state. Could be any type of value.

##### Example
```javascript
import { Store } from 'simple-react-store'

const aStore = new Store({
  name: 'John Doe',
  user: 'john.dow'
})

console.log(aStore.getState())
// {
//  name: 'John Doe',
//  user: 'john.dow'
// }
```

### Update state
#### aStore.setState(someState, actionName = '')
Saves the new state into the store. Remember keep your states inmutable. 
Consider use [immutable.js](https://facebook.github.io/immutable-js/) for it.

##### Arguments

`someState (any)`: The state you want to save.
`actionName (string)['']`: Optionally you can identified the state change with an action name. The name will be shared with all the state change subscribers and redux dev tools.

##### Example
```javascript
import { Store } from 'simple-react-store'

const aStore = new Store({
  name: 'John Doe',
  user: 'john.dow'
})

const updatedState = {
  ...aStore.getState(),
  nationality: 'argentinian'
}
aStore.setState(updatedState, 'Set user nationality')

console.log(aStore.getState())
// {
//  name: 'John Doe',
//  user: 'john.dow'
//  nationality: 'argentinian'
// }
```

### Listen for state changes
#### aStore.onUpdate((state, actionName) => { })
Subscribes for state changes

##### Arguments
`callback (function)`: The function that will be executed any time there is a new state.

###### Callback arguments
`state (any)`: The saved state.
`actionName (string)`: Action name set when updated the state

##### Example
```javascript
import { Store } from 'simple-react-store'

const aStore = new Store()
const newState = {
  name: 'John Doe',
  user: 'john.dow'
}

aStore.onUpdate((state, actionName) => {
  // do something
})

aStore.setState(newState, 'Set user session details')
```

### Connect React components with the Store
#### aStore.connect(resolvePropsCallback)(Component)
Updates the props of a react component every time there is a new state

##### Arguments
`resolvePropsCallback (function(state, [ownProps]))`: The function that will be executed any time there is a new state. It has to return an object of props.
`Component (React Component)`: The react component that will receive the props resolved by `resolvePropsCallback`

##### Returns
`(React Component)`: A hight order component that will update the given component any time there are new props resolved by `resolvePropsCallback`

##### Example
```javascript
import { Store } from 'simple-react-store'
import App from './components/App.js'

const aStore = new Store({
  name: 'John Doe',
  user: 'john.dow'
})
const resolveProps = (state, ownProps) => {
  return {
    title: 'I love simple-react-store',
    user: state.user
  }
}
const Container = aStore.connect(resolveProps)(App)
// <App
//   title='I love simple-react-store'
//   user='John Doe'
// />
```

### Log state changes into Redux Dev Tools
#### connectDevTools(aStore)
Connect a store to [redux dev tools](https://github.com/gaearon/redux-devtools) if available. Any state saved into the store will be logged as long with the given action name

##### Arguments
`aStore (Store instance)`: The created Store instance 

##### Example
```javascript
import { Store, connectDevTools } from 'simple-react-store'

const aStore = new Store()
connectDevTools(aStore)
```