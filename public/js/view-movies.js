window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Yes!');
      console.log(user);

      var postListRef = firebase.database().ref('users');
      postListRef.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log("DATA CHANGE!");
        console.log(data);
        transformPostsIntoHTML(data);
      });
    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
};

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
