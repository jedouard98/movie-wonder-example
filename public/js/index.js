// Be sure to enable Google sign in on the Firebase console in your project for this to work!
// Under the "Authentication" tab.
function signIn() {
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info
    var user = result.user;
    console.log("User information: ");
    console.log(user);
    window.location = 'view-movies.html'; //After successful login, user will be redirected to view-movies.html
  }).catch((error) => {
    // Handle Errors here.
    console.log(error.message + ": " + error.code);
  });
}
