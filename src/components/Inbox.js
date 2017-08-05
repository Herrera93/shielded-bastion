  import React, { Component } from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
//
import {
  firebaseConnect,
  dataToJS,
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
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {List, ListItem} from 'material-ui/List';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

class Inbox extends Component {

  startAt = 1;

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
    this.state.fireRedirect = false
    this.state.gotoCompose = false
  }

  handleEmailClick(event, id){
    event.preventDefault();
    console.log(id);
    this.setState({
      fireRedirect: true,
      email: this.props.profile.receive_emails[id]
    })
  }

  handleDrawer = () => this.setState({open: !this.state.open});

  render() {
    let { uuid, fireRedirect, email, gotoCompose} = this.state;

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
