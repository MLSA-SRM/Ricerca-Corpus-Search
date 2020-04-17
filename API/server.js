const express = require('express')
const searchEngine = require('../Search/bm25_test.js')
var app = express()
var bodyParser = require("body-parser")

app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/search', function(req, res){
    var searchQ= req.body.searchtext
    if(req.body.selectby == "title") {
        searchEngine.searchForTitle(searchQ).then((result) => {
            getDocs(result).then((d) => res.render('searchresult.html', {
            d:d,
            searchtext:searchQ,
            }))
        });
    } else if(req.body.selectby == "abstract") {
        searchEngine.searchForAbstract(searchQ).then((result) => {
            getDocs(result).then((d) => res.render('searchresult.html', {
                d:d,
                searchtext:searchQ,
            }))
        });
    } else if(req.body.selectby == "text") {
        searchEngine.searchForText(searchQ).then((result) => {
            getDocs(result).then((d) => res.render('searchresult.html', {
                d:d,
                searchtext:searchQ,
            }))
        });
    } else if(req.body.selectby == "author") {
        searchEngine.searchForAuthor(searchQ).then((result) => {
            getDocs(result).then((d) => res.render('searchresult.html', {
                d:d,
                searchtext:searchQ,
            }))
        });
    } else if(req.body.selectby == "all") {
      result ={}
      result["searchtext"] = searchQ
      searchEngine.searchForTitle(searchQ).then((result) => {
        getDocs(result).then((d) => searchEngine.searchForAbstract(searchQ).then((result) => {
          getDocs(result).then((e) => searchEngine.searchForText(searchQ).then((result) => {
            getDocs(result).then((f) => res.render('searchresultall.html',{d:d,e:e,f:f,searchtext:searchQ}) )
          }) )
        }))
        });

        

        
      
  }
})

async function getDocs(result) {
	data = {
		resultDocs: []
    };
    // console.log(result.rankedId);
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
