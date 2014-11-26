var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 555});
  
  var glmatrix = require('./glmatrix');
  var vec2 = glmatrix.vec2;

var lasttime = Date.now();
var currenttime = Date.now();
  
var NanoTimer = require('nanotimer');
var timer = new NanoTimer();

  var tempbuffer = {};
wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('received: %s', message);
		wss.broadcast(message);
    });
    
});

wss.broadcast = function(data) {
    for(var i in this.clients)
	{
        this.clients[i].send(data);
	}
};




var ents = [];

var startloop = function(){

	//setInterval(function(){
	timer.setInterval(function(){
		
		lasttime = currenttime;
		currenttime = Date.now();
		var elapsedtime = currenttime - lasttime;
		console.log("dt : " + elapsedtime);

		for(index in ents){
			var s = ents[index].ent.getPosition();
			ents[index].update(elapsedtime/1000.0);
			tempbuffer[index]={id:index, s:{x:s[0], y:s[1] } };
		}

		wss.broadcast(JSON.stringify(tempbuffer));
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

	console.log("random int: " + getRandomInt(0,1000));

	for(var i = 0; i <300;i++){

		var temp = new Ent(getRandomInt(0,1000),getRandomInt(0,1000));
		ents[i]= new Entintel(temp, new Entcontext(temp));

	}





	startloop();


};

init();


