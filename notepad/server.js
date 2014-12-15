var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 555});

var nextid=0;

wss.on('connection', function(ws) {

        var init = [0, nextid++];

     
        ws.send(JSON.stringify(init));

    ws.on('message', function(message) {

        var update = JSON.parse(message);
        var packet = [1, update[0], update[1], update[2], update[3]];

        wss.broadcast(JSON.stringify(packet));
	
    });
    
});


wss.broadcast = function(data) {
    for(var i in this.clients)
	{
        this.clients[i].send(data);
	}
};




//testInsert();