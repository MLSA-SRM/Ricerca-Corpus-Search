const fs = require('fs')

function readDocDB(path) {
    var dataRaw = fs.readFileSync(path);
    data = JSON.parse(dataRaw);
    
    //console.log(data);
    return data;
}

function bm25(searchQuery) {
    data_doc = readDocDB('C:/Users/Powerhouse/Documents/GitHub/Project-ScIRank/Scout/test_data/doc_db.json')

    //your code here

    return searchResult
}

console.log(bm25(''));