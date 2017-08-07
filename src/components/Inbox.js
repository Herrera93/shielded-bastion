  import React, { Component } from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  firebaseConnect,
  pathToJS} from 'react-redux-firebase'
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

  handleEmailClick(event, id){
    event.preventDefault();
    console.log(id);
    this.setState({
      fireRedirect: this.isMobile,
      isSelected: true,
      email: this.props.profile.receive_emails[id]
    });
  }

  handleDrawer = () => this.setState({open: !this.state.open});

  render() {
    let { uuid, fireRedirect, email, gotoCompose, isSelected} = this.state;

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
                <Checkbox style={{marginTop: '12px', width: 'auto'}} onClick={(e) => { e.stopPropagation();}} />
                <Checkbox
                  checkedIcon={<FontIcon className="material-icons" style={{color: '#FFD740'}}>star</FontIcon>}
                  uncheckedIcon={<FontIcon className="material-icons">star_border</FontIcon>}
                  style={{marginTop: '12px', width: 'auto'}}
                  onClick={(e) => { e.stopPropagation();}}
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
          <MediaQuery minDeviceWidth={768} className="page">
            {this.isMobile = false}
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
                    labelColor="white"
                    labelStyle={{padding: '0px'}}
                    className="compose-button"
                    style={{backgroundColor: "#ff6c60"}}
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

const fbWrapped = firebaseConnect()(Inbox);

export default connect(
  ({firebase}) => ({
    profile: pathToJS(firebase, 'profile')
  })
)(fbWrapped);
