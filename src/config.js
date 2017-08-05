module.exports = {
  firebaseConfig : {
    apiKey: "AIzaSyB24Lt2boVoqEvQgBUMD6CYMHfn5IkSndg",
    authDomain: "email-app-667ce.firebaseapp.com",
    databaseURL: "https://email-app-667ce.firebaseio.com",
    projectId: "email-app-667ce",
    storageBucket: "email-app-667ce.appspot.com",
    messagingSenderId: "386335910406"
  },
  reduxFirebase: {
    userProfile: 'users', // root that user profiles are written to
    enableLogging: false, // enable/disable Firebase Database Logging
    updateProfileOnLogin: false // enable/disable updating of profile on login
  }
};
