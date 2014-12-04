
var State = {};

State.create = function(){

        var out = new Float32Array(4);

        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;


        return out; 

};

//state 1 = older
State.lerp = function(state1, state2, alpha){

        var out = State.create();

        out[0] = state1[0]*(1-alpha) + state2[0]*alpha;
        out[1] = state1[1]*(1-alpha) + state2[1]*alpha;
        out[2] = state1[2]*(1-alpha) + state2[2]*alpha;
        out[3] = state1[3]*(1-alpha) + state2[3]*alpha;

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
        if (input[65]==1) {
           ax = -100;

        }
        else if (input[68]==1) {
         ax = 100;

        }
        

        newstate[2] = ax;//oldstate[2] + ax * dt;
        newstate[3] = ay;//oldstate[3] + ay * dt;

        

        newstate[0] = oldstate[0] + ((newstate[2]+oldstate[2])/2) * (dt/1000);
        newstate[1] = oldstate[1] + ((newstate[3]+oldstate[3])/2) * (dt/1000);

        
        
        return newstate;

};


if (typeof (exports) === 'undefined') {

}
else{

   module.exports = State;     
}