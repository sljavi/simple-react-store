import React from 'react'

export class Store {
  constructor(initialState) {
    this.state = initialState || {}
    this.subscribers = []
  }

  notifySubscribers(updatedState, actionName) {
    this.subscribers.forEach((subscriber) => {
      subscriber(updatedState, actionName)
    })
  }

  setState(updatedState, actionName = '') {
    if (this.state !== updatedState) {
      this.state = updatedState
      this.notifySubscribers(updatedState, actionName)
    }
  }

  getState() {
    return this.state
  }

  onUpdate(cb) {
    this.subscribers.push(cb)
  }

  unsubscribe(cb) {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== cb)
  }

  connect(resolveProps) {
    const store = this
    return (Component) => {
      class DynamicComponent extends React.Component {
        state = resolveProps(store.getState())

        componentDidMount() {
          store.onUpdate(this.handleUpdateChange)
        }

        componentWillUnmount() {
          store.unsubscribe(this.handleUpdateChange)
        }

        handleUpdateChange = (updatedState) => {
          this.setState(resolveProps(updatedState))
        }

        render() {
          return <Component {...this.state} />
        }
      }
      return DynamicComponent
    }
  }
}

export const connectDevTools = (store) => {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__
  if (devToolsExtension) {
    const devTools = devToolsExtension.connect({})
    devTools.init(store.getState())
    store.onUpdate((state, action) => {
      devTools.send(action || 'Anonymous action', state)
    })
  }
}
