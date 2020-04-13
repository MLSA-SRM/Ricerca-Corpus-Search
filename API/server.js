const express = require('express')
const searchEngine = require('../Search/bm25_test.js')
var app = express()
var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('OK')
})

app.post('/resultByTitle', function(req, res){ 
   var searchQ= req.body.searchQuery
   searchEngine.searchForTitle(searchQ).then((result) => {
        res.send(result)
    })
})

app.post('/resultByAbstract', function(req, res){ 
    var searchQ= req.body.searchQuery
    searchEngine.searchForAbstract(searchQ).then((result) => {
         res.send(result)
     })
 })

 app.post('/resultByText', function(req, res){ 
    var searchQ= req.body.searchQuery
    searchEngine.searchForText(searchQ).then((result) => {
         res.send(result)
     })
 })

 app.get('/reloadDatabase',function(req,res){
     searchEngine.reloadDatabase()
     res.send('RELOAD DONE')
 })
var server = app.listen(8080, function() {
   var host = server.address().address
   var port = server.address().post
   console.log("Example app listening at http://%s:%s", host, port)
 
   
})
