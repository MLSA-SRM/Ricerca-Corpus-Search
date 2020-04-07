const fs = require('fs');
const keyw = require('keyword-extractor');

function return_keyword(text) {
    ext_opt = {
        language:"english",
        remove_digits: true,
        return_changed_case:true,
        remove_duplicates: true
    }

    var keywords = keyw.extract(text, ext_opt);
    return keywords;
}

module.exports = {
    return_keyword: return_keyword
}

// const posTagger = require( 'wink-pos-tagger' );

// const readTest = fs.readFileSync('C:/Users/Powerhouse/Documents/GitHub/Project-ScIRank/Scout/test_data/id_test1.json');
// const dataThis = JSON.parse(readTest);
// var abstractText = '';
// for (let i=0;i<dataThis.abstract.length;i++) {
//     abstractText += dataThis.abstract[i].text;
// }




//console.log(return_keyword(abstractText).length);
// abstractText = abstractText.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");

    // var tagger = posTagger();
    // var result = tagger.tagSentence(abstractText);
    // var resText = [];

    // for (let i=0;i<result.length;i++) {
    //     if (result[i].pos == 'NN' || result[i].pos == 'NNP') 
    //         resText.push(result[i].value);
    // }
    // resText = [...(new Set(resText))]