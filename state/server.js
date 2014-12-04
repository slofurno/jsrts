var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 555});
  
  var ClientState = require('./clientstate');
  var glmatrix = require('./glmatrix');
  var State = require('./state');
  var vec2 = glmatrix.vec2;

var lasttime = Date.now();
var currenttime = Date.now();
var localtime = 0;


  
var NanoTimer = require('nanotimer');
var timer = new NanoTimer();

function handleMessage(message){

	var data = JSON.parse(message);
	

	if (data.type == 'ping'){

		var elapsedtime = Date.now()-data.time;
		//connectionlist[wsid].pushPing(elapsedtime/2);
		ws.send(JSON.stringify({id:wsid, type:'ping', time:clienttime}));
	}
	else if (data.type == 'update'){

		if (data['time']<=clienttime){
			return;
		}

		var dt = data['time'] - clienttime;

		var newstate;
		console.log("dt " + dt);
		while (data['time'] - clienttime >= 30){

			newstate = State.Integrate(State.create(), mystate.getLast(), data['ks'], 30);
			clienttime+= 30;
			mystate.push(clienttime, newstate);

		}

		wss.broadcast(JSON.stringify({id:wsid, type:'update', time:clienttime, d:[newstate[0],
			newstate[1], newstate[2], newstate[3]]}));

	

		

	}

};




var nextconnid = 0;
var statelist = {};

wss.on('connection', function(ws) {

	var wsid = nextconnid++;
	var clienttime = localtime;
	console.log("localtime " + localtime);
	var mystate = statelist[wsid] = new ClientState();

	var messageQ = [];

	ws.on('message', function(msg) {

		messageQ.push(msg);

		if (messageQ.length>=8){

		var message = messageQ.shift();

		var data = JSON.parse(message);
	

		if (data.type == 'ping'){

			var elapsedtime = Date.now()-data.time;
			//connectionlist[wsid].pushPing(elapsedtime/2);
			ws.send(JSON.stringify({id:wsid, type:'ping', time:clienttime}));
		}
		else if (data.type == 'update'){

			if (data['time']<=clienttime){
				return;
			}

			var dt = data['time'] - clienttime;

			var newstate;
			console.log("dt " + dt);
			while (data['time'] - clienttime >= 30){

				newstate = State.Integrate(State.create(), mystate.getLast(), data['ks'], 30);
				clienttime+= 30;
				mystate.push(clienttime, newstate);

			}

			wss.broadcast(JSON.stringify({id:wsid, type:'update', time:clienttime, d:[newstate[0],
				newstate[1], newstate[2], newstate[3]]}));

		

			

		}

		}

	//console.log('received: %s', message);
		//wss.broadcast(message);
	});

	//connectionlist[wsid]=new Connection();


	ws.send(JSON.stringify({id:wsid, type:'init', time:localtime}));

	//nextconnid++;
    
});

wss.broadcast = function(data) {
    for(var i in this.clients)
	{
        this.clients[i].send(data);
	}
};







var ents = [];

var lastupdate = 0;

var currentframe = -1;

var startloop = function(){

	//setInterval(function(){
	timer.setInterval(function(){
		
		lasttime = currenttime;
		currenttime = Date.now();
		var elapsedtime = currenttime - lasttime;
		localtime+=elapsedtime;


		while(localtime-lastupdate >= 30){
			



			lastupdate+=30;
			
		}

		
		/*

		for(index in ents){
			var s = ents[index].ent.getPosition();
			ents[index].update(elapsedtime/1000.0);
			tempbuffer[index]={id:index, s:{x:s[0], y:s[1] } };
		}

		wss.broadcast(JSON.stringify(tempbuffer));
		*/

	}, '', '30m');
	//},(1000/30));

};


var getRandomInt = function(min, max) {

		if (arguments.length>1){
		
		
		}
		else if (arguments.length>0){
		
			max = min;
			min = 0;
		
		}

  
	return ((Math.random() * (max - min)) + min)|0;
  
};



var init = function(){

	


	startloop();


};

init();


