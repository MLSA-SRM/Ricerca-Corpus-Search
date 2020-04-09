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
    var listoftitles = {
      titles: [],
      id: []
    };
    for(let i=0;i<data_doc.data.length;i++)
    {

        listoftitles.titles.push(data_doc.data[i].title);
        listoftitles.id.push(data_doc.data[i].id);
    }

    let rt = new retrieval(K=2, B=0.75);

    rt.index(listoftitles.titles);

    searchResult_title = {
      rankedResults: [],
      rankedId: []
    };

    searchResult_title.rankedResults=rt.search(searchQuery, 5);
    for(l=0;l<searchResult_title.rankedResults.length;l++)
    {
      searchResult_title.rankedId.push(listoftitles.id[listoftitles.titles.indexOf(searchResult_title.rankedResults[l])]);
    }



    var listofabstract = {
      abstract: [],
      id: []
    };
    for(let j=0; j<data_doc.data.length;j++)
    {
        listofabstract.abstract.push(data_doc.data[j].abstract);
        listofabstract.id.push(data_doc.data[j].id);
    }

    rt.index(listofabstract.abstract);

    searchResult_abstract = {
      rankedResults: [],
      rankedId: []
    };

    searchResult_abstract.rankedResults=rt.search(searchQuery, 5);
    for(m=0;m<searchResult_abstract.rankedResults.length;m++)
    {
      searchResult_abstract.rankedId.push(listofabstract.id[listofabstract.abstract.indexOf(searchResult_abstract.rankedResults[m])]);
    }

   var listoftext ={
     text: [],
     id: []
   };
    for(let k=0; k<data_doc.data.length;k++)
    {
       listoftext.text.push(data_doc.data[k].full_text);
       listoftext.id.push(data_doc.data[k].id);
    }

    rt.index(listoftext.text);

    searchResult_text = {
      rankedResults: [],
      rankedId: []
    };

    searchResult_text.rankedResults=rt.search(searchQuery, 5);

    for(n=0;n<searchResult_text.rankedResults.length;n++)
    {
      searchResult_text.rankedId.push(listoftext.id[listoftext.text.indexOf(searchResult_text.rankedResults[n])]);
    }


    searchResult = {
     title: searchResult_title.rankedId,
      abstract: searchResult_abstract.rankedId,
      text: searchResult_text.rankedId
    };

    return searchResult;
}

console.log(bm25('epidemic', "C:/Users/kljh/Documents/GitHub/Project-ScIRank/Scout/test_data/doc_db.json"));
