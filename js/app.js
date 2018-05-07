var url = 'https://ws.audioscrobbler.com/2.0/'
var api_key = '&api_key=cf750ccfe46454e1247540a136b2f2f4'
var reqBtn = document.getElementById('getGraph');

reqBtn.addEventListener('click', function () {
	document.getElementById("loader").style.display = "block";
	getGraph(document.getElementById('username').value, document.getElementById('depth').value);
});

this.queue = new Queue();
this.obj = {};
this.arr = [];
this.nodes = [];
this.edges = [];
this.count = 0;

function getHead(user, depth) {
	var head_url = url + "?method=user.getinfo&user=" + user + api_key + "&format=json"
	return fetch(head_url).then(function(data){ return data.json() })
	.then(function(json){
		var head = json.user;
		head.key = this.count;
		this.obj[head.name] = head;
		var img = (head.image[1]["#text"] != "") ? (head.image[1]["#text"]) : "https://lastfm-img2.akamaized.net/i/u/avatar170s/818148bf682d429dc215c1705eb27b98.png";
		this.nodes.push({id:head.key, margin:(20*depth), mass:(10 * depth), value:(20*(depth+1)), shape: 'circularImage', label: head.name, image: head.image[2]["#text"], brokenImage:"https://lastfm-img2.akamaized.net/i/u/avatar170s/818148bf682d429dc215c1705eb27b98.png"});
		this.queue.enqueue({user:head.name,key:this.count,depth:parseInt(depth)});
		this.count++;
	});
}

async function getGraph(user, depth) {
	for (var i = 0; i <= depth; i++) {
		this.arr.push([]);	
	}

	this.arr[depth].push(user);
	await getHead(user, depth);

	while(!this.queue.isEmpty()) {
		var obj = queue.dequeue();
		await getGraphHelper(obj.user, obj.key, obj.depth);
	}
	await getNetwork(this.nodes, this.edges);
}

async function getGraphHelper(user, key, depth) {
	var friendList = await getFriends(user, key, depth);
	if ((JSON.stringify(friendList) != "{}") && (depth > 1)) {
		for (friend in friendList) {
			var username = friendList[friend].name;
			this.arr[(depth-1)].push(friendList[friend].name);
			this.queue.enqueue({user:friendList[friend].name,key:friendList[friend].key,depth:(depth-1)});
		}
	}
	return;
}

async function getNetwork(nodes, edges) {
	var container = document.getElementById('mynetwork');
	var data = {
		nodes: this.nodes,
		edges: this.edges
	};
	var options = {
		edges:{smooth:{type:'continuous'}},
	};
	var network = new vis.Network(container, data, options);
	document.getElementById("loader").style.display = "none";
	document.getElementById("mynetwork").style.display = "block";
}

function getFriends(user, key, depth) {
	var friend_url = url + "?method=user.getfriends&user=" + user + api_key + "&format=json"
	return fetch(friend_url).then(function(data){ return data.json() })
	.then(function(json){
		if ("{}" != JSON.stringify(json)) {
			var friendList = {};
			var bound =  Math.min(20,Math.min(json.friends["@attr"].total,json.friends["@attr"].perPage)); 
			for (var i = 0; i < bound; i++) {
				var friend = json.friends.user[i];
				friend.key = this.count;
				var username = friend.name;
				if (!(username in this.obj)) {
					friendList[username] = friend;
					this.obj[username] = friend;
					var img = (friend.image[2]["#text"] != "") ? (friend.image[2]["#text"]) : "https://lastfm-img2.akamaized.net/i/u/avatar170s/818148bf682d429dc215c1705eb27b98.png";
					if (depth <= 1) {
						this.nodes.push({id:friend.key, cid:((depth == 0) ? friend.key : key), margin:(20*depth), value:(Math.max(1,(20*(depth+1)))), shape: 'circularImage', label: username, image: img, brokenImage:"https://lastfm-img2.akamaized.net/i/u/avatar170s/818148bf682d429dc215c1705eb27b98.png"});	
					} else {
						this.nodes.push({id:friend.key, margin:(20*depth), value:(20*(depth+1)), mass:(10 * depth), shape: 'circularImage', label: username, image: img, brokenImage:"https://lastfm-img2.akamaized.net/i/u/avatar170s/818148bf682d429dc215c1705eb27b98.png"});
					}
					this.edges.push({from:key, to:friend.key});
				} else {
					this.edges.push({from:key, to:this.obj[username].key})
				}
				this.count++;
			}
			return friendList;
		}
	});
}