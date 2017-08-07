import React, { Component } from 'react';

import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import './Compose.css'

import {
  firebaseConnect,
  dataToJS,
  pathToJS} from 'react-redux-firebase'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';

class Compose extends Component {

  static propTypes = {
    firebase: PropTypes.object
  }

  constructor(props) {
    super(props);
    if(props.location.state){
      this.state = props.location.state;
    }else{
      this.state = {};
    }
  }

  handleClick(event){
    console.log(this.props);
    let {to, subject, message, uuid} = this.state;

    let email = {
      date: new Date().toISOString(),
      from: {
        name: this.props.profile.name,
        email: this.props.profile.email
      },
      isDeleted: false,
      isImportant: false,
      message: message,
      subject: subject,
      to: to
    }

    var sent_uuid = '';
    _.forOwn(this.props.users, (val, key) => {
      if(val.email === to){
        sent_uuid = key;
      }
    })

    this.props.firebase.push('/users/' + sent_uuid + '/receive_emails', email)
    .then(x => {
      this.props.firebase.push('/users/' + uuid + '/sent_emails', email)
      .then(uuid => {
        this.setState({
          to: '',
          subject: '',
          message: ''
        })
      })
    }).catch(error => {
      console.error(error.message);
    })
  }

  render() {
    let {uuid, gotoInbox, to, subject, message} = this.state;

    if(!uuid){
      return (
        <Redirect to='/login'/>
      )
    }

    return (
      <MuiThemeProvider>
        <div>
          <AppBar
             title="Compose"
             onLeftIconButtonTouchTap={() => this.setState({open: !this.state.open})}
             iconElementRight={<IconButton onTouchTap={(event) => this.handleClick(event)}><FontIcon className="material-icons">send</FontIcon></IconButton>}
           />
           <Drawer
            docked={false}
            width={200}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
          >
            <AppBar title="Menu" iconElementLeft={<FontIcon></FontIcon>} />
            <MenuItem
              primaryText="Inbox"
              leftIcon={<FontIcon className="material-icons">inbox</FontIcon>}
              onTouchTap={(event) => this.setState({gotoInbox: true})}
            />
            <MenuItem
              primaryText="Compose"
              leftIcon={<FontIcon className="material-icons">email</FontIcon>}
            />
            <MenuItem primaryText="Sent Mail" leftIcon={<FontIcon className="material-icons">send</FontIcon>} />
            <MenuItem primaryText="Important" leftIcon={<FontIcon className="material-icons">star</FontIcon>} />
            <MenuItem primaryText="Trash" leftIcon={<FontIcon className="material-icons">delete</FontIcon>} />
            <MenuItem primaryText="Sign Out" leftIcon={<FontIcon className="material-icons">power_settings_new</FontIcon>} />
          </Drawer>
           <div className="compose-container">
             <Paper className="compose-form">
               <TextField
                 type="email"
                 floatingLabelText="To (email)"
                 fullWidth={true}
                 value={to}
                 onChange = {(event,newValue) => this.setState({to:newValue})}
               />
               <br/>
               <TextField
                 floatingLabelText="Subject"
                 fullWidth={true}
                 value={subject}
                 onChange = {(event,newValue) => this.setState({subject:newValue})}
               />
               <br/>
               <TextField
                  floatingLabelText="Message"
                  fullWidth={true}
                  multiLine={true}
                  rows={15}
                  value={message}
                  onChange = {(event,newValue) => this.setState({message:newValue})}
                /><br />
               <br/>
             </Paper>
           </div>
           {gotoInbox && (
            <Redirect to={{
              pathname: '/inbox',
              state: {uuid: uuid}
            }} />
           )}
        </div>
     </MuiThemeProvider>
    );
  }
}

const fbWrapped = firebaseConnect([
  '/users'
])(Compose);

export default connect(
  ({firebase}) => ({
    users: dataToJS(firebase, 'users'),
    profile: pathToJS(firebase, 'profile')
  })
)(fbWrapped);
