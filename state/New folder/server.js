var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 555});
  
  var glmatrix = require('./glmatrix');
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


function ClientState(){

	this.lastupdate;
	this.bufferindex = 0;
	this.buffer = {};
	this.time = {};

	var startstate = State.create();
	startstate[0] = 500;
	startstate[1] = 500;
	startstate[2] = 0;
	startstate[3] = 0;
	this.buffer[0] = startstate;
	this.time[0] = 0;



};


ClientState.prototype.push = function(time, state){

	this.bufferindex++;
	this.bufferindex = this.bufferindex & 31;

	this.time[this.bufferindex] = time;
	this.buffer[this.bufferindex] = state;


};

ClientState.prototype.getLast = function(){

	return this.buffer[this.bufferindex];

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

var State = {};

State.create = function(){

	var out = new Float32Array(4);

	out[0] = 0;
	out[1] = 0;
	out[2] = 0;
	out[3] = 0;


	return out; 

};

State.Integrate = function(newstate, oldstate, input, dt){

	//console.log("new  : " + JSON.stringify(newstate) + "\n old  : " + JSON.stringify(oldstate));

	var ay = 0;
	var ax = 0;

	

	if (input[87]==1) {
           ay = -100;

        }
        else if (input[83]==1) {
         ay = 100;

        }

	

	newstate[2] = ax;//oldstate[2] + ax * dt;
	newstate[3] = ay;//oldstate[3] + ay * dt;

	

	newstate[0] = oldstate[0] + ((newstate[2]+oldstate[2])/2) * (dt/1000);
	newstate[1] = oldstate[1] + ((newstate[3]+oldstate[3])/2) * (dt/1000);

	
	
	return newstate;

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


