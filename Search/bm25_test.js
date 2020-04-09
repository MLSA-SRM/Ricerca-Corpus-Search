const fs = require('fs')
const retrieval = require('retrieval');

function readDocDB(path) {
    var dataRaw = fs.readFileSync(path);
    data = JSON.parse(dataRaw);
    return data;
}

function bm25(searchQuery, path) {
    data_doc = readDocDB(path)

    //your code here
    var listoftitles = [],i;
    for(let i=0;i<data_doc.data.length;i++)
    {
        listoftitles.push(data_doc.data[i].title);
    }

    let rt = new retrieval(K=2, B=0.75);

    rt.index(listoftitles);

    searchResult = rt.search(searchQuery, 5);


    var listofabstract = [],j;
    for(let j=0; j<data_doc.data.length;j++)
    {
        listofabstract.push(data_doc.data[j].abstract);
    }

    rt.index(listofabstract);

    searchResult = rt.search(searchQuery, 5);


    var listoftext = [],k;
    for(let k=0; k<data_doc.data.length;k++)
    {
       listoftext.push(data_doc.data[k].abstract);
     }

     rt.index(listoftext);

searchResult = rt.search(searchQuery, 5);

    return searchResult;
}

console.log(bm25('CHEER', "C:/Users/kljh/Documents/GitHub/Project-ScIRank/Scout/test_data/doc_db.json"));
