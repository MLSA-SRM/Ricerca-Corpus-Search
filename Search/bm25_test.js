	//const fs = require('fs')
const retrieval = require('retrieval');
const str_sim = require('string-similarity');

const keyw = require("../Scout/_scaled/keyword_extract");
const jload = require("../Scout/_scaled/db_handler.js");

const MongoClient = require("mongodb").MongoClient;

function returnEntityFromSearchQ (items, searchQuery) {
	keywFromSearchQ = keyw.return_keyword(searchQuery);
	var entityFromSearchQ = [];
	var fromSearch = [];
	for(var i=0; i<items.length; i++) fromSearch.push(items[i].entity);
	for (var i=0;i<keywFromSearchQ.length;i++) {
		entityFromSearchQ.push(str_sim.findBestMatch(keywFromSearchQ[i], fromSearch).bestMatch.target);
	}
	console.log(entityFromSearchQ);
	return entityFromSearchQ;
}

//------Search By Title--------------
async function searchForTitle(searchQuery) {
	const client = await MongoClient.connect(jload.url);
	var dbo = client.db("mydb");
	const items = await dbo.collection("test_en").find({}).toArray();

	entityFromSearchQ = returnEntityFromSearchQ(items, searchQuery);
	searchQueryMod = entityFromSearchQ.join(' ');

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
	//console.log(titlefromID);

	var listoftitles = {
		titles: titlefromID,
		id: titleID
	};

	let rt = new retrieval(K = 2, B = 0.75);
	rt.index(listoftitles.titles);

	searchResult = {
		rankedResults: [],
		rankedId: []
	};
	searchResult.rankedResults = rt.search(searchQueryMod, 5);
	for (l = 0; l < searchResult.rankedResults.length; l++) {
		searchResult.rankedId.push(listoftitles.id[listoftitles.titles.indexOf(searchResult.rankedResults[l])]);
	}

	console.log(searchResult.rankedId);
	client.close()
	return searchResult;
}

//------Search By Abstract--------------
async function searchForAbstract(searchQuery) {
	const client = await MongoClient.connect(jload.url);
	var dbo = client.db("mydb");
	const items = await dbo.collection("test_en").find({}).toArray();

	entityFromSearchQ = returnEntityFromSearchQ(items, searchQuery);
	searchQueryMod = entityFromSearchQ.join(' ');

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
	
	searchResult.rankedResults = rt.search(searchQueryMod, 5);
	for (l = 0; l < searchResult.rankedResults.length; l++) {
		searchResult.rankedId.push(listofabstract.id[listofabstract.abstract.indexOf(searchResult.rankedResults[l])]);
	}

	console.log(searchResult.rankedId);
	client.close();
	return searchResult
}

//------Search By Text--------------
async function searchForText(searchQuery) {
	const client = await MongoClient.connect(jload.url);
	var dbo = client.db("mydb");
	const items = await dbo.collection("test_en").find({}).toArray();

	entityFromSearchQ = returnEntityFromSearchQ(items, searchQuery);
	searchQueryMod = entityFromSearchQ.join(' ');

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
	
	searchResult.rankedResults = rt.search(searchQueryMod, 5);
	for (l = 0; l < searchResult.rankedResults.length; l++) {
		searchResult.rankedId.push(listoftext.id[listoftext.text.indexOf(searchResult.rankedResults[l])]);
	}

	console.log(searchResult.rankedId);
	client.close()
	return searchResult
}

//------Search By Author--------------
async function searchForAuthor(searchQuery) {
	const client = await MongoClient.connect(jload.url);
	var dbo = client.db("mydb");
	const items = await dbo.collection("test_en").find({}).toArray();

	entityFromSearchQ = returnEntityFromSearchQ(items, searchQuery);
	searchQueryMod = entityFromSearchQ.join(' ');

	authorID = [];
	for(l=0;l<keywFromSearchQ.length;l++) {
		var kw = await dbo.collection("test_en").find({entity: entityFromSearchQ[l]}).toArray();
		authorID = [...authorID, ...kw[0].fromAuthors];
	}
	authorID = [...(new Set(authorID))];
	
	authorFromID = [];
	for(x=0;x<authorID.length;x++) {
		authorFromID.push((await jload.getDataFromDocID(authorID[x])).authors.join(' '));
	}

	var listofauthors = {
		authors: authorFromID,
		id: authorID
	};
	let rt = new retrieval(K = 2, B = 0.75);
	rt.index(listofauthors.authors);

	searchResult = {
		rankedResults: [],
		rankedId: []
	};
	
	searchResult.rankedResults = rt.search(searchQueryMod, 5);
	for (l = 0; l < searchResult.rankedResults.length; l++) {
		searchResult.rankedId.push(listofauthors.id[listofauthors.authors.indexOf(searchResult.rankedResults[l])]);
	}

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
	searchForAuthor: searchForAuthor,
	reloadDatabase: jload.reloadDatabase,
	getDataFromDocID: jload.getDataFromDocID
}

