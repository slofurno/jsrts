var State = State || {};

if (typeof (require) !== 'undefined') {

        State = require('./state');

}




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

ClientState.prototype.getByTime = function(time){

        var temp = this.bufferindex;
        var attempts = 0;
        //console.log(this.time[temp]);
        while (this.time[temp] != time && attempts++ <=30){
                
                temp--;
                temp = temp & 31;
                
               //console.log(this.time[temp]);

        }
   
       

              console.log("attempts " + attempts);  
        
        
        return this.buffer[temp];

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


if (typeof (exports) === 'undefined') {

}
else{

   module.exports = ClientState;     
}


