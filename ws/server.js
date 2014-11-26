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
/**
 * Entcontext
 *
 * @param {Ent} some Ent
 * @param {Entcontext} some Entcontext
 */
var Entintel = function(ent, context){

	var self=this;
	this.ent = ent;
	this.context = context;


	this.update=function(dt){

		if (typeof(this.context.target) === 'undefined'){

			
			this.context.target=findNextTarget();
		
			
		}

		this.ent.turnTowards(this.context.target.ent);
		this.ent.update(dt);


	};


	function findNextTarget(){
	
	var target = getRandomElement(ents);
	
	
		while(self === target){
			
			target=getRandomElement(ents);
		}
		
	
	return target;
	
	};

	this.print = function(){

		var p = this.ent.getPosition();

		console.log("position : " + p[0] + "  " + p[1]);

	};


};
/**
 * Entcontext
 *
 * @param {Ent} some Ent

 */
var Entcontext = function(ent){

	var self = this;
	this.context=undefined;


};

/**
 * Ent

 */
var Ent = function(x,y){

	var self = this;
	var _p = vec2.fromValues(x||0, y||0);
	//glmatrix.vec2.create();
	var _v = glmatrix.vec2.create();
	var _a = glmatrix.vec2.create();

	var vmax = 10;
	var amax = 1;
	
	
	this.turnTowards = function(other){
	
		var heading = vec2.subtract(vec2.create(), other.getPosition(), this.getPosition());
		_a = vec2.normalize(vec2.create(), heading);
		
	};
	
	this.getPosition = function(){
	
		return _p;
	};
	
	this.update = function(dt){
	

		//var dv = vec2.scale(vec2.create(), _a, dt);
		//printVec2(_p,"pos");
		//var v = vec2.add(vec2.create(), _v, dv );
		
		var v = vec2.scale(vec2.create(), _a, vmax );
		//printVec2(v,"vel");
		var dp = vec2.scale(vec2.create(), v, dt);
		//printVec2(dp,"dp");
		var p = vec2.add(vec2.create(), _p, dp);
		//printVec2(p,"pos");
		_v=v;
		_p=p;
		
	
	};





};

var getRandomElement = function(somearray){

	return somearray[getRandomInt(somearray.length-1)];

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

var printVec2 = function(v, text){

	text = text||"some";

	console.log(text + " : " + v[0] + "  " + v[1]);

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


