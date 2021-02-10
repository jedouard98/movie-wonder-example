var firebase_user;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      firebase_user = user;
    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
};

// Configure Firebase storage through the console first, and get this information via profect configuration.
function sendMovieInfoToDatabase() {
  var config = {
    apiKey: "AIzaSyDhR2l262EfycRNxV9ERp6qfUAr6Hd1VTw",
    authDomain: "movie-finder-example.firebaseapp.com",
    // For databases not in the us-central1 location, databaseURL will be of the
    // form https://[databaseName].[region].firebasedatabase.app.
    // For example, https://your-database-123.europe-west1.firebasedatabase.app
    databaseURL: "https://movie-finder-example.firebaseio.com",
    storageBucket: "movie-finder-example.appspot.com"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
  else {
    firebase.app(); // if already initialized, use that one
  }

  var database = firebase.database();


  // upload title:
  var title = document.getElementById('title-of-movie').value;

  // upload description:
  var opinion = document.getElementById('movie-opinion').value;

  // upload author:
  var author = firebase_user.displayName;

  // upload image
  var imageUrl = document.getElementById('movie-poster').value;

  firebase.database().ref('users/' + firebase_user.uid + "/" + title).set({
    title: title,
    opinion: opinion,
    author : author,
    imageUrl : imageUrl
  });
}
