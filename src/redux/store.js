import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import makeRootReducer from './reducers'
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase'
import { firebaseConfig as fbConfig, reduxFirebase as reduxConfig } from './../config';
// import { updateLocation } from './../reducers/location'
import {createLogger}from 'redux-logger'
// import createHistory from 'history/createBrowserHistory'
//
// export const history = createHistory()

export function createStores(initialState = {}){

  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [
    thunk.withExtraArgument(getFirebase),
    createLogger()
    // This is where you add other middleware like redux-observable
  ]

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      reactReduxFirebase(fbConfig, reduxConfig)
    )
  )

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  // store.unsubscribeHistory = history.listen(updateLocation(store))

  return store
}
