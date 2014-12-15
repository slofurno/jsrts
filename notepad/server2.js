var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 555});

var nextid = 0;
var cursors = [];

wss.on('connection', function(ws) {

        var myid = nextid++;
        cursors[myid] = _bufferlen;

    ws.on('message', function(message) {

     
        var command = message|0;

        if (command === 1){

                cursors[myid]--;

        }
        else if (command === 2){

                cursors[myid]++;
        }
        else{

                _cursorpos = cursors[myid];
                wss.broadcast(JSON.stringify({d:message, pos:_cursorpos}));
                

                processCommand(message|0);

               

        }
		
    });
    
});


wss.broadcast = function(data) {
    for(var i in this.clients)
	{
        this.clients[i].send(data);
	}
};


var LINEWIDTH = 80;
var INDENTSIZE = 8;
var BUFFERMAX = 1000;
var LINEHEIGHT = 20;

var _topoffset = 0;
var _cursorpos = 0;
var _bufferlen = 0;

var _buffer = new ArrayBuffer(BUFFERMAX);
var _bufferview = new Uint8Array(_buffer);

_bufferview[0] = 0x0A;


function insertEle(value, offset){

        //_bufferview.set([value], offset);
        writeArray(_bufferview, [value], offset);
}


function shiftElements(offset, distance){

        //console.log("offset : %d, distance: %d", offset, distance);
        var numeles = _bufferlen-offset;
        var elements = new Uint8Array(_buffer, offset, numeles);
        
        var newposition = offset+distance;
        
        //_bufferview.set(elements, newposition);
        writeArray(_bufferview, elements, newposition);
        _bufferlen+=distance;


}

function writeArray(array, eles, pos){

        array.set(eles,pos);

}

function printBuffer(){
/*
        ctx.clearRect(0,0,600,400);

        var elements = new Uint8Array(_buffer, 0, _bufferlen);
        var startline = 0;
        var linenumber = 0;

        for (var i = 0; i < _bufferlen; i++){
                //console.log(elements[i]);
                if (elements[i] === 10){

                        var line = getLine(startline, i-startline);
                        ctx.fillText(line,10,linenumber*LINEHEIGHT+LINEHEIGHT);
                        startline=i+1;
                        linenumber++;
                }
        }
*/
        var out = String.fromCharCode.apply(null, _bufferview);
        console.log(out);

        
       

}

function getLine(start, length){

        var line = new Uint8Array(_buffer, start, length);
        var out = String.fromCharCode.apply(null, line);

        return out;
        //ctx.fillText(out,10,50);

}

function testInsert(){

        printBuffer();
        var starttime = Date.now();

        insertAtCursor(56);
        insertAtCursor(56);
        insertAtCursor(56);
        insertAtCursor(56);
        insertAtCursor(56);
        insertAtCursor(56);
        insertAtCursor(56);
    
        printBuffer();

        deleteAtCursor(3);

        var endtime = Date.now();

        console.log(endtime- starttime);
        printBuffer();
}



function changeIndent(){

        var linestart = currentLineStart();
       // console.log("Q?" + linestart + " FF : " + _cursorpos);
        var temp = (_cursorpos-linestart) % INDENTSIZE;

        
        var spacestoadd = INDENTSIZE - temp;

        //console.log("new spaces : " + spacestoadd);

        for (var i = 0; i < spacestoadd; i++){

                insertAtCursor(0x20);
        }

}

//^ 0
//000000^ 8
//0000000000000000^ 16

function currentLineStart(){

        var i = _cursorpos - 1;

        while (i>=0 && _bufferview[i] != 0x0A){

                i--;
        }

        return ++i;
}

function deleteAtCursor(count){

        count = count || 1;

        if (_cursorpos < count){
                return;
        }


        shiftElements(_cursorpos, -count);
        //_cursorpos-=count;

        updateCursors(_cursorpos, -count);
        

}

function updateCursors(count){

        for (var i = 0; i < nextid; i++){

                if (_cursorpos<=cursors[i]){

                        cursors[i] += count;
                }

        }
}

function insertAtCursor(ele){

        shiftElements(_cursorpos, 1);
        insertEle(ele, _cursorpos);

        updateCursors(1);
        //_cursorpos++;
}


function processCommand(e){

        switch (e){

        case 13://enter
                insertAtCursor(0x0A);
                break;    
        case 8://backspace   
                deleteAtCursor(1);
                break;
        case 9: //tab 
                changeIndent();
                break;
        default:
                insertAtCursor(e);

        }

        printBuffer();
}


//testInsert();