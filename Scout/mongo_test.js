const mongodb = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
// var url = "mongodb://localhost:27017/mydb";

//----creation-----
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });

//----insertOne----
// MongoClient.connect(url, (err, db) => {
//   if (err) throw err;
//   var dbo = db.db("mydb");
//   var myobj = {name: 'company inc.', address: 'highway 37'};
//   dbo.collection('test_db').insertOne(myobj, (err, res) =>{
//     if (err) throw err;
//     console.log('1 doc inserted');
//   });
//   db.close();
// });

//------find-------
MongoClient.connect(url, (err, db) => {
  if (err) throw err;

  var dbo = db.db('mydb');
  dbo.collection('test_db').find({}).toArray((err, res) => {
    if (err) throw err;
    console.log(res[0]);
  });

  db.close();
})