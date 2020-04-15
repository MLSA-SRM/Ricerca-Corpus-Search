	//const fs = require('fs')
const retrieval = require('retrieval');

const keyw = require("../Scout/_scaled/keyword_extract")
const jload = require("../Scout/_scaled/db_handler.js")

const MongoClient = require("mongodb").MongoClient;


//------Search By Title--------------
async function searchForTitle(searchQuery) {
	keywFromSearchQ = keyw.return_keyword(searchQuery);

	const client = await MongoClient.connect(jload.url);
	var dbo = client.db("mydb");
	const items = await dbo.collection("test_en").find({}).toArray();

	entityFromSearchQ = [];
	for(i=0; i<items.length; i++) {
		for(e=0;e<keywFromSearchQ.length;e++) {
			if(keywFromSearchQ[e] == items[i].entity) {
				entityFromSearchQ.push(keywFromSearchQ[e]);
			}
		}
	}

	titleID = [];
	for(l=0;l<keywFromSearchQ.length;l++) {
		var kw = await dbo.collection("test_en").find({entity: entityFromSearchQ[l]}).toArray()
		titleID = [...titleID, ...kw[0].fromTitle]
	}
	titleID = [...(new Set(titleID))]
	
	titlefromID = []
	for(x=0;x<titleID.length;x++) {
		titlefromID.push((await jload.getDataFromDocID(titleID[x])).title)
	}

	var listoftitles = {
		titles: titlefromID,
		id: titleID
	};

	let rt = new retrieval(K = 2, B = 0.75);
	rt.index(listoftitles.titles);

	searchResult_title = {
		rankedResults: [],
		rankedId: []
	};
	searchResult_title.rankedResults = rt.search(searchQuery, 5);
	for (l = 0; l < searchResult_title.rankedResults.length; l++) {
		searchResult_title.rankedId.push(listoftitles.id[listoftitles.titles.indexOf(searchResult_title.rankedResults[l])]);
	}

	//console.log(searchResult_title);
	client.close()
	return searchResult_title
}

//------Search By Abstract--------------
async function searchForAbstract(searchQuery) {
	keywFromSearchQ = keyw.return_keyword(searchQuery);

	const client = await MongoClient.connect(jload.url);
	var dbo = client.db("mydb");
	const items = await dbo.collection("test_en").find({}).toArray();

	entityFromSearchQ = [];
	for(i=0; i<items.length; i++) {
		for(e=0;e<keywFromSearchQ.length;e++) {
			if(keywFromSearchQ[e] == items[i].entity) {
				entityFromSearchQ.push(keywFromSearchQ[e]);
			}
		}
	}

	abstractID = [];
	for(l=0;l<keywFromSearchQ.length;l++) {
		var kw = await dbo.collection("test_en").find({entity: entityFromSearchQ[l]}).toArray();
		abstractID = [...abstractID, ...kw[0].fromAbstract];
	}
	abstractID = [...(new Set(abstractID))];
	
	abstractFromID = []
	for(x=0;x<abstractID.length;x++) {
		abstractFromID.push((await jload.getDataFromDocID(abstractID[x])).abstract);
	}

	var listofabstract = {
		abstract: abstractFromID,
		id: abstractID
	};

	let rt = new retrieval(K = 2, B = 0.75);
	rt.index(listofabstract.abstract);

	searchResult = {
		rankedResults: [],
		rankedId: []
	};
	
	searchResult.rankedResults = rt.search(searchQuery, 5);
	for (l = 0; l < searchResult.rankedResults.length; l++) {
		searchResult.rankedId.push(listofabstract.id[listofabstract.abstract.indexOf(searchResult.rankedResults[l])]);
	}

	//console.log(searchResult);
	client.close();
	return searchResult
}

//------Search By Text--------------
async function searchForText(searchQuery) {
	keywFromSearchQ = keyw.return_keyword(searchQuery);

	const client = await MongoClient.connect(jload.url);
	var dbo = client.db("mydb");
	const items = await dbo.collection("test_en").find({}).toArray();

	entityFromSearchQ = [];
	for(i=0; i<items.length; i++) {
		for(e=0;e<keywFromSearchQ.length;e++) {
			if(keywFromSearchQ[e] == items[i].entity) {
				entityFromSearchQ.push(keywFromSearchQ[e]);
			}
		}
	}

	textID = [];
	for(l=0;l<keywFromSearchQ.length;l++) {
		var kw = await dbo.collection("test_en").find({entity: entityFromSearchQ[l]}).toArray();
		textID = [...textID, ...kw[0].fromText];
	}
	textID = [...(new Set(textID))];
	
	textFromID = [];
	for(x=0;x<textID.length;x++) {
		textFromID.push((await jload.getDataFromDocID(textID[x])).full_text);
	}

	var listoftext = {
		text: textFromID,
		id: textID
	};

	let rt = new retrieval(K = 2, B = 0.75);
	rt.index(listoftext.text);

	searchResult = {
		rankedResults: [],
		rankedId: []
	};
	
	searchResult.rankedResults = rt.search(searchQuery, 5);
	for (l = 0; l < searchResult.rankedResults.length; l++) {
		searchResult.rankedId.push(listoftext.id[listoftext.text.indexOf(searchResult.rankedResults[l])]);
	}

	//console.log(searchResult);
	client.close()
	return searchResult
}


//searchForTitle("This is literature for coronavirus and infection");
// searchForAbstract("This is literature for coronavirus and infection");
//searchForText("This is literature for coronavirus and infection");

module.exports = {
	searchForTitle: searchForTitle,
	searchForAbstract: searchForAbstract,
	searchForText: searchForText,
	reloadDatabase: jload.reloadDatabase,
	getDataFromDocID: jload.getDataFromDocID
}

