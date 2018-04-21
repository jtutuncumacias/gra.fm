var url = 'https://ws.audioscrobbler.com/2.0/'

var token = new URLSearchParams(window.location.search);
var api_key = '&api_key=cf750ccfe46454e1247540a136b2f2f4'
var api_sig = '&api_sig='+md5("api_keycf750ccfe46454e1247540a136b2f2f4methodauth.getsessiontoken"+token.get("token")+"c486fea288f58b9777900fee760af2e1")
var session = url+'?method=auth.getsession&'+token.toString()+api_key+api_sig+'&format=json'


var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
      		console.log(this.responseText);
			console.log(JSON.parse(this.responseText));

			var response = JSON.parse(xhttp.responseText);
			console.log(response);
	
			var name = response.session.name
			var key = response.session.key
			console.log(name);
			console.log(key);

			document.getElementById("info").textContent = name;
    	}
  	};
  	xhttp.open("GET", session, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();

