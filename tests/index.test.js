import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Store, connectDevTools } from '../src/index'

Enzyme.configure({ adapter: new Adapter() })

describe('Store', () => {
  it('initializes a default state', () => {
    const store = new Store()
    expect(store.getState()).toEqual({})
  })

  it('initializes a custom state', () => {
    const state = {
      foo: 'bar'
    }
    const store = new Store(state)
    expect(store.getState()).toEqual(state)
  })

  describe('setState', () => {
    it('set a new state', () => {
      const store = new Store()
      const state = {
        foo: 'bar'
      }
      store.setState(state)
      expect(store.getState()).toEqual(state)
    })
  })

  describe('onUpdate', () => {
    it('receives updated states', () => {
      const store = new Store()
      const onUpdate = jest.fn()
      const onUpdateTwo = jest.fn()
      const state = {
        foo: 'bar'
      }
      store.onUpdate(onUpdate)
      store.onUpdate(onUpdateTwo)
      store.setState(state, 'action name')
      expect(onUpdate).toHaveBeenCalledWith(state, 'action name')
      expect(onUpdateTwo).toHaveBeenCalledWith(state, 'action name')
    })
  })

  describe('unsubscribe', () => {
    it('stops receiving updated states', () => {
      const store = new Store()
      const onUpdate = jest.fn()
      const state = {
        foo: 'bar'
      }
      store.onUpdate(onUpdate)
      store.unsubscribe(onUpdate)
      store.setState(state, 'action name')
      expect(onUpdate).not.toHaveBeenCalled()
    })
  })

  describe('connect', () => {
    it('updates connected component props when the state changes', () => {
      const store = new Store({
        foo: 'bar'
      })
      const resolveProps = state => ({
        bar: 'foo',
        ...state
      })
      const SomeComponent = props => (<div {...props} />)
      const ConnectedComponent = store.connect(resolveProps)(SomeComponent)
      const wrapper = shallow(<ConnectedComponent />)
      expect(wrapper.props()).toEqual({
        foo: 'bar',
        bar: 'foo'
      })
      store.setState({
        bar: 'tux'
      })
      wrapper.update()
      expect(wrapper.props()).toEqual({
        foo: 'bar',
        bar: 'tux'
      })
      wrapper.unmount()
    })
  })
})

describe('connectDevTools', () => {
  it('connects and initializes if dev tools is available', () => {
    const devTools = {
      init: jest.fn(),
      send: jest.fn()
    }
    const state = {
      foo: 'bar'
    }
    window.__REDUX_DEVTOOLS_EXTENSION__ = {
      connect: () => devTools
    }
    const store = new Store(state)
    connectDevTools(store)
    expect(devTools.init).toHaveBeenCalledWith(state)
  })

  it('notifies new actions and states', () => {
    const devTools = {
      init: jest.fn(),
      send: jest.fn()
    }
    const state = {
      foo: 'bar'
    }
    const stateTwo = {
      bar: 'foo'
    }
    window.__REDUX_DEVTOOLS_EXTENSION__ = {
      connect: () => devTools
    }
    const store = new Store()
    connectDevTools(store)
    store.setState(state, 'action name')
    expect(devTools.send).toHaveBeenCalledWith('action name', state)
    store.setState(stateTwo)
    expect(devTools.send).toHaveBeenCalledWith('Anonymous action', stateTwo)
  })
})
