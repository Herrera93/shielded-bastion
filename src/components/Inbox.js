  import React, { Component } from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  firebaseConnect,
  pathToJS,
dataToJS} from 'react-redux-firebase'
import { Redirect } from 'react-router'

import './Inbox.css'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import {List, ListItem} from 'material-ui/List';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton'

var MediaQuery = require('react-responsive');

class Inbox extends Component {

  startAt = 1;
  isMobile = true;

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

  componentDidMount(){
    this.setState({to: 'alex.herrera@email.com', message: 'test', subject: 'test'});
  }

  handleEmailClick(event, id){
    event.preventDefault();
    console.log(this.isMobile);
    this.setState({
      fireRedirect: this.isMobile,
      isSelected: true,
      email: this.props.profile.receive_emails[id]
    });
  }

  handleDrawer = () => this.setState({open: !this.state.open});

  emailSubmit(event){
    console.log(this.state);
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
    let { uuid, fireRedirect, email, gotoCompose, isSelected, to, subject, message} = this.state;

    if(!uuid){
      return (
        <Redirect to='/login'/>
      )
    }

    let receive_emails = this.props.profile ? this.props.profile.receive_emails : {};

    const listItems = [];
    _.forOwn(receive_emails, (email, key) => {
      let d = new Date(email.date)
      listItems.push(
        <div key={key}>
          <ListItem
            primaryText={email.from.name}
            leftCheckbox={
              <div style={{display: 'flex', width: '80px'}}>
                <Checkbox style={{marginTop: '12px', width: 'auto'}} onClick={(e) => { e.stopPropagation();}} onTouchTap={(e) => { e.stopPropagation();}} />
                <Checkbox
                  checkedIcon={<FontIcon className="material-icons" style={{color: '#FFD740'}}>star</FontIcon>}
                  uncheckedIcon={<FontIcon className="material-icons">star_border</FontIcon>}
                  style={{marginTop: '12px', width: 'auto'}}
                  onClick={(e) => { e.stopPropagation();}}
                  onTouchTap={(e) => { e.stopPropagation();}}
                  checked={email.isImportant}
                />
              </div>
            }
            secondaryText={
              <p>
                <span style={{color: 'black'}}>{email.subject}</span>
                <br />{email.message}
              </p>
            }
            rightAvatar={<span>{d.toLocaleDateString()}</span>}
            secondaryTextLines={2}
            onTouchTap={(event) =>  this.handleEmailClick(event, key)}
            onClick={(event) =>  this.handleEmailClick(event, key)}
            style={{paddingLeft: '96px'}}
          />
          <Divider />
        </div>
      )
    });

    const navString = this.startAt + "-" + listItems.length + " of " + listItems.length;

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleDrawer}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={(event) => this.emailSubmit(event)}
      />,
    ];

    return (
      <MuiThemeProvider>
        <div>
          <MediaQuery maxDeviceWidth={768}>
            <AppBar
               title="Inbox"
               onLeftIconButtonTouchTap={this.handleDrawer}
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
              />
              <MenuItem
                primaryText="Compose"
                leftIcon={<FontIcon className="material-icons">email</FontIcon>}
                onTouchTap={(event) => this.setState({gotoCompose: true})}
              />
              <MenuItem primaryText="Sent Mail" leftIcon={<FontIcon className="material-icons">send</FontIcon>} />
              <MenuItem primaryText="Important" leftIcon={<FontIcon className="material-icons">star</FontIcon>} />
              <MenuItem primaryText="Trash" leftIcon={<FontIcon className="material-icons">delete</FontIcon>} />
              <MenuItem primaryText="Sign Out" leftIcon={<FontIcon className="material-icons">power_settings_new</FontIcon>} />
            </Drawer>
            <div className="inbox-container">
              <Paper className="searchBar">
                <FontIcon className="material-icons searchIcon" style={{fontSize: '40px'}}>search</FontIcon>
                <TextField
                  floatingLabelText="Search for email or contact"
                  inputStyle={{ textAlign: 'center' }}
                  floatingLabelStyle={{ width: '95%', textAlign: 'center',  }}
                  floatingLabelFocusStyle={{textAlign: 'start'}}
                  style={{ width: '95%' }}
                />
              </Paper>
              <Paper className="inbox">
                <Toolbar style={{width: '100%', backgroundColor: 'white'}}>
                  <ToolbarGroup firstChild={true}>
                    <Checkbox
                      iconStyle={{width: '24px', height: '24px', margin: 'auto'}}
                      style={{width: '48px', height: '48px'}}
                    />
                    <IconButton tooltip="Delete">
                       <FontIcon className="material-icons">delete</FontIcon>
                    </IconButton>
                    <IconButton tooltip="Label">
                       <FontIcon className="material-icons">label</FontIcon>
                    </IconButton>
                  </ToolbarGroup>
                  <ToolbarGroup lastChild={true}>
                    <ToolbarTitle text={navString} style={{color: 'black'}}/>
                  </ToolbarGroup>
                </Toolbar>
                <Divider style={{width: '100%'}} />
                <div className="inbox-content">
                  <List style={{padding: '0px'}}>
                    {listItems}
                 </List>
                </div>
              </Paper>
            </div>
          </MediaQuery>
          <MediaQuery minDeviceWidth={768}>
            {(matches) => {
              if (matches) {
                this.isMobile = false;
                return null;
              } else {
                this.isMobile = true;
                return null;
              }
            }}
          </MediaQuery>
          <MediaQuery minDeviceWidth={768} className="page">
            <AppBar
              title="Inbox"
              iconElementLeft={<div></div>}
            />
            <div className="inbox-container">
              <sidenav className="inbox-menu">
                <div className="inbox-menu-header">
                  <RaisedButton
                    backgroundColor="#ff6c60"
                    label="Compose"
                    labelColor="#ffffff"
                    labelStyle={{lineHeight: '60px'}}
                    overlayStyle={{height: '100%'}}
                    className="compose-button"
                    style={{backgroundColor: "#ff6c60", height: '60px'}}
                    onTouchTap={this.handleDrawer}
                  />
                </div>
                <Divider style={{backgroundColor: 'rgba(0,0,0,.12)'}}/>
                <List>
                  <ListItem primaryText="Inbox" leftIcon={<FontIcon className="material-icons">inbox</FontIcon>} />
                  <ListItem primaryText="Sent Mail" leftIcon={<FontIcon className="material-icons">send</FontIcon>} />
                  <ListItem primaryText="Important" leftIcon={<FontIcon className="material-icons">start</FontIcon>} />
                  <ListItem primaryText="Trash" leftIcon={<FontIcon className="material-icons">delete</FontIcon>} />
                  <ListItem primaryText="Sign Out" leftIcon={<FontIcon className="material-icons">power_settings_new</FontIcon>} />
                </List>
                <Divider style={{backgroundColor: 'rgba(0,0,0,.12)'}}/>
                <List>
                  <ListItem primaryText="Work" leftIcon={<FontIcon className="material-icons" style={{color: 'orange'}}>label</FontIcon>} />
                  <ListItem primaryText="Family" leftIcon={<FontIcon className="material-icons" style={{color: 'lightgreen'}}>label</FontIcon>} />
                  <ListItem primaryText="Friends" leftIcon={<FontIcon className="material-icons" style={{color: 'peru'}}>label</FontIcon>} />
                  <ListItem primaryText="Office" leftIcon={<FontIcon className="material-icons" style={{color: 'seagreen'}}>label</FontIcon>} />
                </List>
              </sidenav>
              <div className="inbox-content">
                <Paper className="searchBar">
                  {/* <FontIcon className="material-icons searchIcon" style={{fontSize: '40px'}}>search</FontIcon> */}
                  <TextField
                    floatingLabelText="Search for email or contact"
                    inputStyle={{ textAlign: 'center' }}
                    floatingLabelStyle={{ width: '80%', textAlign: 'center',  }}
                    floatingLabelFocusStyle={{textAlign: 'start'}}
                    style={{ width: '80%', marginBottom: '10px' }}
                  />
                </Paper>
                <Paper className="inbox">
                  <Toolbar style={{width: '100%', backgroundColor: 'white'}}>
                    <ToolbarGroup firstChild={true}>
                      <Checkbox
                        iconStyle={{width: '24px', height: '24px', margin: 'auto'}}
                        style={{width: '48px', height: '48px'}}
                      />
                      <IconButton tooltip="Delete">
                         <FontIcon className="material-icons">delete</FontIcon>
                      </IconButton>
                      <IconButton tooltip="Label">
                         <FontIcon className="material-icons">label</FontIcon>
                      </IconButton>
                    </ToolbarGroup>
                    <ToolbarGroup lastChild={true}>
                      <ToolbarTitle text={navString} style={{color: 'black'}}/>
                    </ToolbarGroup>
                  </Toolbar>
                  <Divider style={{width: '100%'}} />
                  <div className="inbox-emails">
                    <div className="inbox-email-list">
                      <List style={{padding: '0px'}}>
                        {listItems}
                      </List>
                    </div>
                    <div className="inbox-email">
                      {!isSelected ? (
                        <div style={{color: '#bdbdbd'}} className="message-before-selected">
                          <FontIcon className="material-icons" style={{color: '#bdbdbd', fontSize: '120px'}}>email</FontIcon>
                          <span style={{fontSize: '24px'}}>Select and email to read</span>
                        </div>
                      ) : (
                        <Paper className="inbox-email-paper">
                          <div className="email-header">
                            <div className="email-metadata">
                              <h2>{email.subject}</h2>
                              <span>From: {email.from.name} ({email.from.email})</span><br />
                              <span>To: Me</span>
                            </div>
                            <div className="flex-fill"></div>
                            <div className="email-options">
                              {email.isImportant ? (
                                 <FontIcon className="material-icons" style={{color: '#FFD740'}}>star</FontIcon>
                               ) : (
                                 <FontIcon className="material-icons">star_border</FontIcon>
                               )}
                            </div>
                          </div>
                          <Divider style={{width: '100%'}} />
                          <div className="email-message">
                            {email.message}
                          </div>
                        </Paper>
                      )}
                    </div>
                  </div>
                </Paper>
              </div>
            </div>
            <Dialog
              title="Send Email"
              actions={actions}
              modal={true}
              open={this.state.open}
            >
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
               />
            </Dialog>
          </MediaQuery>

           {fireRedirect && (
            <Redirect to={{
              pathname: '/email',
              state: {email: email, uuid: uuid}
            }} />
           )}
           {gotoCompose && (
            <Redirect to={{
              pathname: '/compose',
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
])(Inbox);

export default connect(
  ({firebase}) => ({
    users: dataToJS(firebase, 'users'),
    profile: pathToJS(firebase, 'profile')
  })
)(fbWrapped);
