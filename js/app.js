var url = 'https://ws.audioscrobbler.com/2.0/'

var token = new URLSearchParams(window.location.search);
var api_key = '&api_key=cf750ccfe46454e1247540a136b2f2f4'
var api_sig = '&api_sig='+md5("api_keycf750ccfe46454e1247540a136b2f2f4methodauth.getsessiontoken"+token.get("token")+"c486fea288f58b9777900fee760af2e1")
var session = url+'?method=auth.getsession&'+token.toString()+api_key+api_sig+'&format=json'

//login
var user;
var key;

var login = new XMLHttpRequest();
login.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var response = JSON.parse(login.responseText);
		user = response.session.name;
		key = response.session.key;

		document.getElementById("info").textContent = user;
	}
};
login.open("GET", session, true);
login.setRequestHeader("Content-type", "application/json");
login.send();

//get friends
var friend_url = "?method=user.getfriends&user=" + user + api_key + "&format=json"
var friendList = [];

var friends = new XMLHttpRequest();
friends.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
  		var response = JSON.parse(friends.responseText);
		console.log(response);

		for (friend in response.friends) {
			console.log("pushing a new friend");
			console.log(friend);
			friendList.push(friend);
		}
	}
};
friends.open("GET", friend_url, true);
friends.setRequestHeader("Content-type", "application/json");
friends.send();