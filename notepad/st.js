var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

//connect away
MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
  if (err) throw err;
  console.log("Connected to Database");

  //simple json record
        var document = {name:"David", title:"About MongoDB"};
  
        //insert record
        db.collection('test').insert(document, function(err, records) {
                if (err) throw err;
                console.log("Record added as "+records[0]._id);
        });
});