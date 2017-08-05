import React, { Component } from 'react';

import { Redirect } from 'react-router';

import './Email.css'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

class Email extends Component {

  constructor(props) {
    super(props);
    if(props.location.state){
      this.state = props.location.state;
    }else{
      this.state = {};
    }
  }

  render() {
    let { email, uuid, gotoInbox, gotoCompose} = this.state;

    if(!uuid || !email){
      return (
        <Redirect to='/login'/>
      )
    }

    return (
      <MuiThemeProvider>
        <div>
          <AppBar
             title="Email"
             onLeftIconButtonTouchTap={() => this.setState({open: !this.state.open})}
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
              onTouchTap={(event) => this.setState({gotoCompose: true})}
            />
            <MenuItem primaryText="Sent Mail" leftIcon={<FontIcon className="material-icons">send</FontIcon>} />
            <MenuItem primaryText="Important" leftIcon={<FontIcon className="material-icons">star</FontIcon>} />
            <MenuItem primaryText="Trash" leftIcon={<FontIcon className="material-icons">delete</FontIcon>} />
            <MenuItem primaryText="Sign Out" leftIcon={<FontIcon className="material-icons">power_settings_new</FontIcon>} />
          </Drawer>
           <div className="email-container">
             <Paper className="email">
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
           </div>
           {gotoCompose && (
            <Redirect to={{
              pathname: '/compose',
              state: {uuid: uuid}
            }} />
           )}
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

export default Email;
