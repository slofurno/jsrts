function MinQueue(){

	var self=this;
	var _length = -1;
	var _pq = []; //where in outside array is my element
	var _qp = []; //where in pq is my outside element
	var _keys = [];



	this.insert = function(index, priority){

		_length++;
		_qp[index] = _length;
		_pq[_length] = index;
		_keys[index] = priority;
		upHeap(_length);
		
	};

	this.removeMin = function(){

		var min = _pq[0];
		swap(0, _length--);
		downHeap(0);
		_qp[min] = -1;
		_keys[_pq[_length+1]]=null;
		_pq[_length+1]=-1;
		return min;

	};

	this.decreaseKey = function(index, priority){

		

	}

	function upHeap(k){

		var iparent = (k-1)/2|0;

		while (k>0  && greater(iparent, k)){

			swap(k, iparent);
			k = iparent;
			iparent = (k-1)/2|0;

		}

		

	};

	function downHeap(k){

		while (2*k + 1 <= _length){

			var ichild = 2*k+1;

			if (ichild<_length && greater(ichild, ichild+1)){
				ichild++;
			}
			if (!greater(k, ichild)){
				break;
			}
			else{
				swap(k, ichild);
				k=ichild;
			}

		}

	};

	function greater(i, j){

		return _keys[_pq[i]] > _keys[_pq[j]];

	};

	function swap(i, j){

		

		var temp = _pq[i];
		_pq[i] = _pq[j];
		_pq[j] = temp;

		_qp[_pq[i]]=i;
		_qp[_pq[j]]=j;



	};


};


var testinput = [5,3,1,6,5,8,1,2,5,3,4];

var Q = new MinQueue();

for (var i in testinput){

	Q.insert(i, testinput[i]);

}

for (var i in testinput){

	console.log(testinput[Q.removeMin()]);

}