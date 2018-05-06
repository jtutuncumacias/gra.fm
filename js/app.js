var url = 'https://ws.audioscrobbler.com/2.0/'

var token = new URLSearchParams(window.location.search);
var api_key = '&api_key=cf750ccfe46454e1247540a136b2f2f4'
var api_sig = '&api_sig='+md5("api_keycf750ccfe46454e1247540a136b2f2f4methodauth.getsessiontoken"+token.get("token")+"c486fea288f58b9777900fee760af2e1")
var session = url+'?method=auth.getsession&'+token.toString()+api_key+api_sig+'&format=json'

//login
//localStorage.setItem('username', "buypil");

var login = new XMLHttpRequest();
login.open("GET", session, true);
login.setRequestHeader("Content-type", "application/json");
login.send();
login.onreadystatechange = function() {
	if (login.readyState == 4 && login.status == 200) {
		var response = JSON.parse(login.responseText);
		console.log(response);

		localStorage.setItem('username', response.session.name);
		localStorage.setItem('key', response.session.key);

		document.getElementById("info").textContent = localStorage.username;
	}
};

//get friends
var friend_url = url + "?method=user.getfriends&user=" + localStorage.getItem("username") + api_key + "&format=json"

var friends = new XMLHttpRequest();
friends.open("GET", friend_url, true);
friends.setRequestHeader("Content-type", "application/json");
friends.send();
friends.onreadystatechange = function() {
	if (friends.readyState == 4 && friends.status == 200) {
  		var response = JSON.parse(friends.responseText);
		
		var friendList = [];

		for (var i = 0; i < response.friends["@attr"].total; i++) {
			var friend = response.friends.user[i];
			//console.log(friend);
			friendList.push(friend);
		}
		localStorage.setItem('friendList', friendList);
	}
};

console.log(localStorage.getItem("friendList"));