import React, { Component } from 'react';

// import _ from 'lodash';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
//
import { firebaseConnect } from 'react-redux-firebase'
import { Redirect } from 'react-router'

import './Login.css'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';

class Login extends Component {

  static propTypes = {
    firebase: PropTypes.object
  }

  state = {
    //top form post
    username: 'john.doe@email.com',
    password: 'a12345',
    fireRedirect: false
  };

  handleClick(event){
    let {username, password} = this.state;
    this.props.firebase.login({
      email: username,
      password: password
    }).then(uuid => {
      this.setState({
        fireRedirect: true,
        uuid: uuid
      })
    }).catch(error => {
      console.error(error.message);
    })
  }


  render() {
    let { username, password, fireRedirect, uuid } = this.state;
    return (
      <MuiThemeProvider>
        <div className="login-container">
          <Paper className="form-container">
            <div className="form">
              <h3 style={{margin: 0}}>
                <FontIcon className="material-icons" style={{verticalAlign: 'middle', lineHeight: '36px'}}>email</FontIcon>
                &nbsp;Email App
              </h3>
              <TextField
                hintText="Enter your Username"
                floatingLabelText="Username"
                fullWidth={true}
                value={username}
                onChange = {(event,newValue) => this.setState({username:newValue})}
              />
              <br/>
              <TextField
                 type="password"
                 fullWidth={true}
                 hintText="Enter your Password"
                 floatingLabelText="Password"
                 value={password}
                 onChange = {(event,newValue) => this.setState({password:newValue})}
               />
              <br/>
              <RaisedButton label="Login" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
              {fireRedirect && (
               <Redirect to={{
                 pathname: '/inbox',
                 state: {uuid: uuid}
               }} />
              )}
            </div>
          </Paper>
        </div>
       </MuiThemeProvider>
    );
  }
}

const style = {
 margin: 15,
};

export default firebaseConnect()(Login);
