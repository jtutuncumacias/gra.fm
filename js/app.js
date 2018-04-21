var url = 'https://ws.audioscrobbler.com/2.0/'

var tokenParam = new URLSearchParams(window.location.search);
var token = tokenParam.toString();
console.log(token);
console.log(tokenParam.get("token"));

var key = '&api_key=cf750ccfe46454e1247540a136b2f2f4'
var sig = '&api_sig='+md5("api_keycf750ccfe46454e1247540a136b2f2f4methodauth.getsessiontoken"+tokenParam.get("token")+"c486fea288f58b9777900fee760af2e1")

var session = url+'?method=auth.getsession&'+token+key+sig+'&format=json'


var xhttp = new XMLHttpRequest();
    xhttp.open("GET", session, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);
console.log(response);

var session_key = response.session.key
var name = response.session.name

console.log(name);

document.getElementById("info").textContent = name;