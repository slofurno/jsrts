function HashHeap(){

	var self=this;
	var _length = 0;
	var _array = [];
	

	function Node(key, value, index){

		this.key = key;
		this.value = value;
		this.index = index;


	};

	this.insert = function(key, value){

		var tempnode = new Node(key, value, _length);
		_array[_length]=tempnode;
		_length++;
		upHeap(tempnode);


	};

	function upHeap(node){

		var index = node.index;
		var iparent = (index/2-1)|0;
		if (iparent>=0){

			if (_array[iparent].key > _array[index].key){

				swap(childnode, parentnode);

			}

		}

	};

	function swap(childnode, parentnode){

		var ichild = childnode.index;
		var iparent = parentnode.index;

		var temp = _array[iparent];
		_array[iparent] = _array[ichild];
		_array[ichild] = temp;

	};


};