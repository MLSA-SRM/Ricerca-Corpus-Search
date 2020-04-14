const express = require('express')
const searchEngine = require('../Search/bm25_test.js')
var app = express()
var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('OK')
})

 

   app.post('/result', function(req, res){
    var searchQ= req.body.searchQuery
   if(req.body.searchBy == "title")
   {
   searchEngine.searchForTitle(searchQ).then((result) => {
      getDocs(result).then((d) => res.send(d))
   })
}
   if(req.body.searchBy == "abstract")
   {
    searchEngine.searchForAbstract(searchQ).then((result) => {
    res.send(getDocs(result))
   })
}
   if(req.body.searchBy == "text")
   {
    searchEngine.searchForText(searchQ).then((result) => {
    res.send(getDocs(result))
   })
   }
})

async function getDocs(result) {
	data = {
		resultDocs: []
	};
	for (let i=0;i<result.rankedId.length;i++) {
		data.resultDocs.push((await searchEngine.getDataFromDocID(result.rankedId[i])));
	}
	return data;
}
 
//    function getDocs(result) {
//       data = {
//          resultDocs: []
//       };
//       for (let i=0;i<result.rankedId.length;i++) {
//          data.resultDocs.push(searchEngine.getDataFromDocID(result.rankedId[i]));
//          console.log(searchEngine.getDataFromDocID(result.rankedId[i]))
//       }
//       return data;
// }

 app.get('/reloadDatabase',function(req,res){
     searchEngine.reloadDatabase()
     res.send('RELOAD DONE')
 })
var server = app.listen(8080, function() {
   var host = server.address().address
   var port = server.address().post
   console.log("Example app listening at http://%s:%s", host, port)
 
   
})
