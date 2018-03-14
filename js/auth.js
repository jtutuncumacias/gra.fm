var auth = 'http://www.last.fm/api/auth/?api_key=cf750ccfe46454e1247540a136b2f2f4'
var callback = '&cb=https://jtutuncumacias.github.io/gra.fm/graph.html'

var loginBtn = document.getElementById('login');

loginBtn.addEventListener('click', function () {
	window.location.assign(auth+callback);
});
