const express = require('express')
const searchEngine = require('../Search/bm25_test.js')
var app = express()
var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/search', function(req, res){
    var searchQ= req.body.searchtext
    if(req.body.selectby == "title") {
        searchEngine.searchForTitle(searchQ).then((result) => {
        getDocs(result).then((d) => res.send(d))
        });
    }
    if(req.body.selectby == "abstract") {
        searchEngine.searchForAbstract(searchQ).then((result) => {
        res.send(getDocs(result))
        });
    }
    if(req.body.selectby == "text") {
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

app.get('/reloadDatabase', function(req, res){
    searchEngine.reloadDatabase()
    res.send('RELOADING')
})

var server = app.listen(8080, function() {
   var host = server.address().address
   var port = server.address().post
   console.log("Example app listening at http://${host}:${port}")
})
