var url = 'https://ws.audioscrobbler.com/2.0/'
var api_key = '&api_key=cf750ccfe46454e1247540a136b2f2f4'
var reqBtn = document.getElementById('getGraph');
var leakBtn = document.getElementById('getLeakers');
var firstTime = true;
var avatarURL = "img/avatar.jpg";
var normal = true;

if (reqBtn != null) {
	reqBtn.addEventListener('click', function () {
		document.getElementById("loader").style.display = "block";
		getGraph(document.getElementById('username').value, document.getElementById('depth').value);
	});
}

if (leakBtn != null) {
	normal = false;
  leakBtn.addEventListener('click', function () {
	getLeakers(document.getElementById('username').value,
						 document.getElementById('artist').value,
						 document.getElementById('track').value,
						 document.getElementById('matches').value);
  });
}

this.queue = new Queue();
this.obj = {};
this.arr = [];
this.nodes = [];
this.edges = [];
this.count = 0;
this.leakers = {};
this.track = {};
this.list = document.getElementById('leakers');

function getTrackInfo(artist, track) {
	var track_url = url + "?method=track.getinfo" + api_key + "&artist=" + artist + "&track=" + track + "&format=json"
	return fetch(track_url).then(function(data){ return data.json() })
	.then(function(json){
		this.track = json.track;
	});
}

function getHead(user, depth) {
	var head_url = url + "?method=user.getinfo&user=" + user + api_key + "&format=json"
	return fetch(head_url).then(function(data){ return data.json() })
	.then(function(json){
		firstTime = false;
		var head = json.user;
		head.key = this.count;
		this.obj[head.name] = head;
		if (normal) {
		var img = (head.image[1]["#text"] != "") ? (head.image[1]["#text"]) : avatarURL;
		this.nodes.push({id:head.key, margin:(20*depth), mass:(10 * depth), value:(20*(depth+1)), shape: 'circularImage', label: head.name, image: head.image[2]["#text"], brokenImage:avatarURL});
		this.queue.enqueue({user:head.name,key:this.count,depth:parseInt(depth)});
		this.count++;
		} else {
			this.queue.enqueue({user:head.name});
		}
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
	getNetwork(this.nodes, this.edges);
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

async function getLeakers(user, artist, track, matches) {
	this.matches = matches;
	if(firstTime) {
		await getHead(user);
		await getTrackInfo(artist,track);	
	}
	while(this.matches > 0) {
		var obj = queue.dequeue();
		await getLeakersHelper(obj.user, obj.key, artist, track);
	}
}

async function getLeakersHelper(user, key, artist, track) {
	var track_url = url + "?method=track.getinfo" + api_key + "&username=" + user + "&artist=" + artist + "&track=" + track + "&format=json"
	fetch(track_url).then(function(data){ return data.json() })
	.then(function(json){
		if (json.track.userplaycount != 0) {
			var entry = document.createElement('li');	
			entry.appendChild(document.createTextNode(user + '\t' + json.track.userplaycount + " scrobbles"));
			console.log(this.obj[user]);
			this.list.appendChild(entry);
			this.matches--;
		}
	});
	var friendList = await getFriends(user, key, 0);
	for (friend in friendList) {
		var username = friendList[friend].name;
		this.queue.enqueue({user:friendList[friend].name,artist:artist,track:track});
	}
	return;
}

function getNetwork(nodes, edges) {
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
			if (json.error != null) return friendList;
			for (var i = 0; i < json.friends.user.length; i++) {
				var friend = json.friends.user[i];
				friend.key = this.count;
				var username = friend.name;
				if (!(username in this.obj)) {
					friendList[username] = friend;
					this.obj[username] = friend;
					if (normal) {
					var img = (friend.image[2]["#text"] != "") ? (friend.image[2]["#text"]) : avatarURL;
					if (depth <= 1) {
						this.nodes.push({id:friend.key, cid:((depth == 0) ? friend.key : key), margin:(20*depth), value:(Math.max(1,(20*(depth+1)))), shape: 'circularImage', label: username, image: img, brokenImage:avatarURL});	
					} else {
						this.nodes.push({id:friend.key, margin:(20*depth), value:(20*(depth+1)), mass:(10 * depth), shape: 'circularImage', label: username, image: img, brokenImage:avatarURL});
					}
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
