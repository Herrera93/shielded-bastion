import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { Provider } from 'react-redux';
import {createStores} from './redux/store';

injectTapEventPlugin();

const initialState = window.___INITIAL_STATE__
const store = createStores(initialState)

 ReactDOM.render(
   <Provider store={store}>
     <App />
   </Provider>,
   document.getElementById('root')
 );
