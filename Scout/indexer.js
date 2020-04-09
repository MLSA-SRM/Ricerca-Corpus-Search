const fs = require('fs');
const path = require('path')
const keyw_ext = require('./keyword_extract');
const mysql = require('mysql');

// const con = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Qwerty#123',
//     database: 'test_db'
// });

function readFiles(callback) {
    fs.readdir('C:/Users/Powerhouse/Documents/GitHub/Project-ScIRank/Scout/test_data/test_json/', function (err, files) {
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

readFiles(mainRun);

function loadJSON(file_list) {
    var data = [];
    for (let i=0;i<file_list.length;i++) {
        var pathJson = path.join(
            'C:/Users/Powerhouse/Documents/GitHub/Project-ScIRank/Scout/test_data/test_json',
            file_list[i]
        );

        var readTest = fs.readFileSync(pathJson);
        var dataThis = JSON.parse(readTest);
        
        var title = dataThis.metadata.title;

        var abstract = '';
        for (let i=0;i<dataThis.abstract.length;i++) {
            abstract += " " + dataThis.abstract[i].text;
        }

        var full_text = '';
        for (let i=0;i<dataThis.body_text.length;i++) {
            full_text += " " + dataThis.body_text[i].text;
        }

        var authors = [];
        for (let i=0;i<dataThis.metadata.authors.length;i++) {
            authors.push(dataThis.metadata.authors[i].first)
        }

        var data_unit = {
            id: i,
            title: title,
            abstract: abstract,
            full_text: full_text,
            authors: authors,
            file_path: pathJson
        }

        //console.log(data_unit.authors);
        data.push(data_unit);
    }
    return data;
}

function mainRun(file_list) {
    data = loadJSON(file_list);
    retrieveTitleEntities(data);
    retrieveAbstractEntities(data);
    retrieveFullEntities(data);
    author_entities = retrieveAuthorEntities(data);
    writeDocDB(data);
}

function retrieveTitleEntities(data) {
    for (let i=0;i<data.length;i++) {
        list_of_these_entities = keyw_ext.return_keyword(data[i].title);
        for(let j=0;j<list_of_these_entities.length;j++) {
            row = {
                entity: list_of_these_entities[j],
                id: data[i].id
            }
            //console.log(row);
            //add document to db entity if entity exists
            //add new entity and add document to new entity if entity doesn't exist
            plusTitleRow(row);
        }
    }
}

function retrieveAbstractEntities(data) {
    for (let i=0;i<data.length;i++) {
        list_of_these_entities = keyw_ext.return_keyword(data[i].abstract);
        for(let j=0;j<list_of_these_entities.length;j++) {
            row = {
                entity: list_of_these_entities[j],
                id: data[i].id
            }
            //console.log(row);
            //add document to db entity if entity exists
            //add new entity and add document to new entity if entity doesn't exist
        }
    }
}

function retrieveFullEntities(data) {
    for (let i=0;i<data.length;i++) {
        list_of_these_entities = keyw_ext.return_keyword(data[i].full_text);
        for(let j=0;j<list_of_these_entities.length;j++) {
            row = {
                entity: list_of_these_entities[j],
                id: data[i].id
            }
            //console.log(row);
            //add document to db entity if entity exists
            //add new entity and add document to new entity if entity doesn't exist
        }
    }
}

function retrieveAuthorEntities(data) {
    for (let i=0;i<data.length;i++) {
        for (let j=0;j<data[i].authors.length;j++) {
            row = {
                author: data[i].authors[j],
                id: data[i].id
            }
            //console.log(row);
            //add document to db author if author exists
            //add new author and add document to new author if entity doesn't exist
        }
    }
}

// write data to document db
function writeDocDB (data) {
    db = {
        data: data
    }
    fs.writeFileSync('C:/Users/Powerhouse/Documents/GitHub/Project-ScIRank/Scout/test_data/doc_db.json', JSON.stringify(db));
    //console.log(JSON.parse(fs.readFileSync('C:/Users/Powerhouse/Documents/GitHub/Project-ScIRank/Scout/test_data/doc_db.json')));

    // for (let i=0;i<data.length;i++) {
    //     doc_id_row = {
    //         id: data[i].id,
    //         path: data[i].file_path
    //     }
    //     con.query('INSERT INTO doc_id_db SET ?', doc_id_row, (err, res) => {console.log(res);});
    // }

    // con.end(() => {});
}

function plusTitleRow(row) {
    
    //check for row.entity in table
    

    //if exists -> check if row.id in [list of id] in title col
    
    
    //if !exists -> add entity and add row.id in [list of id] in title col
}