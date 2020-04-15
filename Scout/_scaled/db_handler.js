const fs = require('fs');
const path = require('path');

const keyw = require('./keyword_extract.js');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://ricera:scirank@cluster0-a9sai.azure.mongodb.net/test?retryWrites=true&w=majority";

function readJSONFiles(callback) {
    fs.readdir('../Project-ScIRank/Scout/_scaled/test_json/', function (err, files) {
        var file_list = []
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 

        files.forEach(function (file) {
            file_list.push(file); 
        });
        return callback(file_list);
    });
}

function getFilePaths(file_list) {
    var data = [];
    for (let i=0;i<file_list.length;i++) {
        var pathJson = path.join(
            '../Project-ScIRank/Scout/_scaled/test_json/',
            file_list[i]
        );
        
        var data_unit = {
            _id: i,
            file_path: pathJson
        }
        data.push(data_unit);
    }
    return data;
}


async function importJSONFiles (file_list) {
    data = getFilePaths(file_list);
   
    const client = await MongoClient.connect(url);
    var dbo = client.db("mydb");

    var cols = await dbo.listCollections().toArray();
    function checkExists (cols, str){
        _x = []
        for (let i=0;i<cols.length;i++) {
            if (str == (cols[i].name)) {
                return true;
            }
        }
        return false;
    }

    // cleanup
    if (checkExists(cols, 'test_db') && checkExists(cols, 'test_en')) {
        // await dbo.collection('test_db').drop();
        // await dbo.collection('test_en').drop();
        
    } else {
        await dbo.createCollection('test_db')
        await dbo.createCollection('test_en')
    }

    let filesAlreadyRead = await dbo.collection('test_db').find({}).toArray();
    let fileLastRead = filesAlreadyRead[filesAlreadyRead.length-1];
    if (fileLastRead) {
        await dbo.collection('test_db').findOneAndDelete({_id: fileLastRead._id});
    }
    filesAlreadyRead = filesAlreadyRead.slice(0, filesAlreadyRead.length);

    let filesToRead = data.filter(a => !filesAlreadyRead.map(b => b._id).includes(a._id));
    console.log("Files to read" + " " + filesToRead.length.toString());

    for (let i=0;i<filesToRead.length;i++) {    
        console.log('Reading ' + filesToRead[i]._id.toString() + ' ' + filesToRead[i].file_path.toString())
        var ins1 = await dbo.collection("test_db").insertOne(filesToRead[i]);
        var this_doc = await getDataFromDocID(filesToRead[i]._id);

        var entities = {
            fromTitle: keyw.return_keyword(this_doc.title),
            fromAbstract: keyw.return_keyword(this_doc.abstract),
            fromText: keyw.return_keyword(this_doc.full_text)
        };

        // entities from title
        for (let x=0;x<entities.fromTitle.length;x++) {
            let this_entity = entities.fromTitle[x]
            var res = await dbo.collection('test_en').findOne({entity: this_entity});
            if(res) {
                var updatedIDs = res.fromTitle;
                updatedIDs.push(this_doc._id)
                var wr = await dbo.collection('test_en').updateOne({entity: this_entity}, {$set: {fromTitle: updatedIDs}});
            } else {
                var wr = await dbo.collection('test_en').insertOne({entity: this_entity, fromTitle: [this_doc._id], fromAbstract: [], fromText: []});    
            } 
        }

        // entities from Abstract
        for (let x=0;x<entities.fromAbstract.length;x++) {
            let this_entity = entities.fromAbstract[x]
            var res = await dbo.collection('test_en').findOne({entity: this_entity});
            if(res) {
                var updatedIDs = res.fromAbstract;
                updatedIDs.push(this_doc._id)
                var wr = await dbo.collection('test_en').updateOne({entity: this_entity}, {$set: {fromAbstract: updatedIDs}});
            } else { 
                var wr = await dbo.collection('test_en').insertOne({entity: this_entity, fromTitle: [], fromAbstract: [this_doc._id], fromText: []});    
            } 
        }

        // entities from Full_text
        for (let x=0;x<entities.fromText.length;x++) {
            let this_entity = entities.fromText[x]
            var res = await dbo.collection('test_en').findOne({entity: this_entity});
            if(res) {
                var updatedIDs = res.fromText;
                updatedIDs.push(this_doc._id)
                var wr = await dbo.collection('test_en').updateOne({entity: this_entity}, {$set: {fromText: updatedIDs}});
            } else {
                var wr = await dbo.collection('test_en').insertOne({entity: this_entity, fromTitle: [], fromAbstract: [], fromText: [this_doc._id]});    
            } 
        }
        console.log('Read ' + filesToRead[i]._id.toString() + ' ' + filesToRead[i].file_path.toString());
    }
    console.log(await dbo.collection('test_db').find({}).toArray());
    client.close();
}


async function getDataFromDocID(id) {
    //get id and details from data_doc
    const client = await MongoClient.connect(url);
    var dbo = client.db('mydb');

    //console.log(await dbo.collection('test_db').find({_id: id}).toArray())[0].file_path;
    var pathJson = (await dbo.collection('test_db').find({_id: id}).toArray())[0].file_path;
  
    //console.log(pathJson);
    client.close();

    var readTest = fs.readFileSync(pathJson);
    var dataThis = JSON.parse(readTest);

    if (dataThis.metadata.title) {
        var title = dataThis.metadata.title;
    }
        
    if (dataThis.abstract) {
        var abstract = '';
        for (let i=0;i<dataThis.abstract.length;i++) {
            abstract += " " + dataThis.abstract[i].text;
        }
    }

    if (dataThis.body_text){
        var full_text = '';
        for (let i=0;i<dataThis.body_text.length;i++) {
            full_text += " " + dataThis.body_text[i].text;
        }
    }

    if (dataThis.metadata.authors) {
        var authors = [];
        for (let i=0;i<dataThis.metadata.authors.length;i++) {
            authors.push(dataThis.metadata.authors[i].first)
        }
    }


    data_this_doc = {
        _id: id,
        title: title,
        abstract: abstract,
        full_text: full_text,
        authors: authors,
        file_path: pathJson
    }

    //console.log(data_this_doc.title);
    return data_this_doc;
}

function reloadDatabase() {
    readJSONFiles(importJSONFiles);
}
//getDataFromDocID(2).then((res) => console.log(res));

reloadDatabase();

module.exports = {
    url: url,
    reloadDatabase: reloadDatabase,
    getDataFromDocID: getDataFromDocID
};