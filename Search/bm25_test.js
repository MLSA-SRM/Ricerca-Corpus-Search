const fs = require('fs')
const retrieval = require('retrieval');



const keyw = require("GitHub\\Project-ScIRank\\Scout\\_scaled\\keyword_extract.js")

const jload = require("C:\\Users\\kljh\\Documents\\GitHub\\Project-ScIRank\\Scout\\_scaled\\json_loader.js")
const MongoClient = require("mongodb").MongoClient;
function readDocDB(path) {
  var dataRaw = fs.readFileSync(path);
  data = JSON.parse(dataRaw);
  return data;
}


async function bm25(searchQuery)
{
  keywFromSearchQ=keyw.return_keyword(searchQuery);

  const client = await MongoClient.connect(jload.url);
  var dbo = client.db("mydb");
  const items = await dbo.collection("test_en").find({}).toArray();


  
  entityFromSearchQ=[]

  for(i=0; i<items.length; i++)
  {
    for(e=0;e<keywFromSearchQ.length;e++)
    {
      if(keywFromSearchQ[e] == items[i].entity)

      entityFromSearchQ.push(keywFromSearchQ[e])
    }
  }
 titleID=[]

 
for(l=0;l<keywFromSearchQ.length;l++)
{
 const kw= await dbo.collection("test_en").find({entity: entityFromSearchQ[l]}).toArray()
 titleID=[...titleID,...kw[0].fromTitle]
}
titleID = [...(new Set(titleID))]

titlefromID=[]

for(x=0;x<titleID.length;x++)
{
  titlefromID.push((await jload.getDataFromDocID(titleID[x])).title)
  //console.log((await jload.getDataFromDocID(titleID[x])).title)
}
  
  
    var listoftitles = {
    titles: [],
    id: []
  };

  listoftitles.titles=titlefromID
  listoftitles.id=titleID

  let rt = new retrieval(K = 2, B = 0.75);

 rt.index(listoftitles.titles);

  searchResult_title = {
    rankedResults: [],
    rankedId: []
  };

  searchResult_title.rankedResults = rt.search(searchQuery, 5);
  for (l = 0; l < searchResult_title.rankedResults.length; l++) 
  {
    searchResult_title.rankedId.push(listoftitles.id[listoftitles.titles.indexOf(searchResult_title.rankedResults[l])]);
  }


  

//   abstractID=[]

 
// for(l=0;l<keywFromSearchQ.length;l++)
// {
//  const kw= await dbo.collection("test_en").find({entity: entityFromSearchQ[l]}).toArray()
//  abstractID=[...abstractID,...kw[0].fromabstract]
// }
// abstractID = [...(new Set(abstractID))]

// abstractfromID=[]

// for(x=0;x<abstractID.length;x++)
// {
//   abstractfromID.push((await jload.getDataFromDocID(abstractID[x])).abstract)
// }
  
  
//     var listofabstract = {
//     abstract: [],
//     id: []
//   };

//   listofabstract.abstract=abstractfromID
//   listofabstract.id=abstractID

//    rt = new retrieval(K = 2, B = 0.75);

//  rt.index(listofabstract.abstract);

//   searchResult_abstract = {
//     rankedResults: [],
//     rankedId: []
//   };

//   searchResult_abstract.rankedResults = rt.search(searchQuery, 5);
//   for (l = 0; l < searchResult_abstract.rankedResults.length; l++) 
//   {
//     searchResult_abstract.rankedId.push(listofabstract.id[listofabstract.abstract.indexOf(searchResult_abstract.rankedResults[l])]);
//   }

//   textID=[]

 
// for(l=0;l<keywFromSearchQ.length;l++)
// {
//  const kw= await dbo.collection("test_en").find({entity: entityFromSearchQ[l]}).toArray()
//  textID=[...textID,...kw[0].fromText]
// }
// textID = [...(new Set(textID))]

// textfromID=[]

// for(x=0;x<textID.length;x++)
// {
//   textfromID.push((await jload.getDataFromDocID(textID[x])).text)
  
// }
  
  
//     var listoftext = {
//     text: [],
//     id: []
//   };

//   listoftext.text=textfromID
//   listoftext.id=textID

//    rt = new retrieval(K = 2, B = 0.75);

//  rt.index(listoftext.text);

//   searchResult_text = {
//     rankedResults: [],
//     rankedId: []
//   };

//   searchResult_text.rankedResults = rt.search(searchQuery, 5);
//   for (l = 0; l < searchResult_title.rankedResults.length; l++) 
//   {
//     searchResult_text.rankedId.push(listoftext.id[listoftext.text.indexOf(searchResult_text.rankedResults[l])]);
//   }

  console.log(searchResult_title)

  client.close()
}
  
bm25("This is literature for coronavirus and infection")
