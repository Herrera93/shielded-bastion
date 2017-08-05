import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
// import {history} from './../redux/store';
import Login from './Login'
import Inbox from './Inbox'
import Email from './Email'
import Compose from './Compose'

// import _ from 'lodash';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
//
// import {
//   firebaseConnect,
//   isLoaded,
//   pathToJS,
//   dataToJS // needed for full list and once
// } from 'react-redux-firebase'
//
// import RaisedButton from 'material-ui/RaisedButton';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/inbox" component={Inbox}/>
          <Route path="/email" component={Email}/>
          <Route path="/compose" component={Compose}/>
          <Redirect to="/login"/>
        </Switch>
      </Router>
    );
  }
}

export default App;
