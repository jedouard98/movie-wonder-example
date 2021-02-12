# Movie Wonder Example
https://movie-finder-example.web.app/

This is an example of a bare bones studeent exemplar for the program. This document details some tips for setting up Firebase as well as some thoughts on certain design choices made.

## Setting up the project and deploying changes.

https://firebase.google.com/docs/hosting/quickstart

The steps here are standard for setting up a base project. After you setup the project in online consoles and install the firebase CLI, you should run:

```bash
firebase init hosting

```

This then gives a series of defaults that are okay for the first use of a simple firebase project. This guide then gives instructions on how to deploy the packages live so that you can see it ono the web. Beware of browser caching -- this prevented me from seeing changes that I was making to the site before I realized this was happening. Either be sure to refresh your browser cache (pressing SHIFT while clicking refresh on a mac works), disable browser caching, or for easier development, use an emulator: 


```bash
firebase emulators:start
```

This is probably what the students should do at first to avoid accidental caching issues. It uses their computer as a host and makes development quicker. All one needs to do is save the files to continue.


## Authentication setup

This is easily done with the Firestore API. This is what the code looks like for doing this with client side JS: 
```javascript

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
}).catch((error) => {
  // Handle Errors here.
});
```

(Be sure to enable Google Sign in on Firebase consiole through the Authentication tab! Otherwise this will fail.)

From there, the user result.user object contains information about the user, including a useful "uid" that can be used as an ID for database information insertion (as opposed to names). 

## Setting up Firebase API calls

After setting up Firebase Realtime Database on the Firebase console first, this is all that's necessary to set up Firebase Database API calls. This information is all available through project settings on the console.

```javascript
var config = {
  apiKey: "",
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
```

After, you can start making calls to the database. Make sure that when configuring the database, you set the rules to be in "Test Mode". This allows all reads and writes to the database that persist for a month. This is the simplest way to set it up without having to fiddle with rules and have to teach that. 

## Querying through the database

This is an example of what querying looked like in this example app. Definitely worth looking into:

```javascript
  for (const user in data) {
    console.log(data[user]);
    for (const movies in data[user]) {
      console.log(data[user][movies]);
    }
  }
```

## Generating HTML live

This is an example of how I managed to generate things live onto the page. Firebase lets you add a listener to a portion of the database, and from there you can perform a functino when that change occurs. Also, featuring the long, very confusing strings of HTML:

```javascript

var postListRef = firebase.database().ref('users');
postListRef.on('value', (snapshot) => {
  const data = snapshot.val();
  console.log("DATA CHANGE!");
  console.log(data);
  transformPostsIntoHTML(data);
});
 
 ...
      
function transformPostsIntoHTML(data) {
  var inner_html = "";
  for (const user in data) {
    console.log(data[user]);
    for (const movies in data[user]) {
      console.log(data[user][movies]);
      inner_html += "<div class=\"bg-light p-5 rounded mt-5\"><h1>" + data[user][movies].title;
      inner_html += "</h1><h4>" + data[user][movies].author;
      inner_html += "</h4><div class=\"row\"><div class=\"col-9\"><p class=\"lead\">" + data[user][movies].opinion;
      inner_html += "</p></div><div class=\"col text-center\"><img src=\"" + data[user][movies].imageUrl + "\" width=\"150\" height=\"200\"></div></div><a class=\"btn btn-lg btn-primary\" href=\"/docs/5.0/components/navbar/\" role=\"button\">View more</a></div>";
    }
  }
  document.getElementById('all-content').innerHTML = inner_html;
}
```

## Routing

You can set up routing through the generated firebase.json file. More information here: https://firebase.google.com/docs/hosting/full-config

```json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],

    "rewrites": [ {
      "source": "**",
      "destination": "/index.html"
    } ],

    "cleanUrls": true
  }
}
```
However, to navigate through from one page to another in this example application through javascript, I utilised this javascript function:


```javascript
window.location = 'index.html'
```

I definitely feel like there is a more refined way to do this that I didn't have time to look into this.

## Firebase Storage vs Firebase Realtime Database

I went through both of these options (but did not look into Firebase Firestore option). 

Firebase Storage allows students the ability to store and upload imagese programmatically in their projects. However, the ability to retrieve data from Storage requires a few extra steps. Firstly, as far as I know, Storage does not give the ability to traverse folders for information. Therefore, if you want reference to where things are in the database, you'd need to store some type of metadata file where you manually populated this information yourself. In addition to this, the Storage API will give back URLs. Thus, if we went down this route, we'd need to add extra steps oon how to convert this URL into data usable by the app. This is not as muuch of an issue for images (as the URL can be used as the src attribute) but is a problem for storing other types of data, like strings. It's not impossible to do this, but for the sake of simplicity I'm personally not a fan of this approach.

Firebase Realtime Database allows one to store key value pairs that are strings very easily. One thing I like about this is the fact that thhe database will update on the webpage life. Thus, if students want to know if their query went through, they'd be able to observe this immediately without refresing the page. This also helps with collaborationl if multiple students were trying to connect to the same database, they'd see each other's changese live. This database also supports returning nests of this data in iterable object formats, so in other words, you can list root keys and retrieve all the information nested inside of it. Navigating these trees can be tricky and probably require some time getting adjusted to. Lastly, it's easy to listen to changes in thie database and cause live HTML updates. The big downside of this is the inability to storage images. 

With that being said, I prefer Realtime Database to Storage. Might spend some time looking at Firebase Firestore, but from cursory searches I think Realtime Database will be supreme in terms of simplicity.
