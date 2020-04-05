const fs = require('fs');
const pdf = require('pdf-parse');


async function parsePDF(path) {

    let dataBuffer = fs.readFileSync(path);

    return await pdf(dataBuffer);
}

const path = "C:/Users/Powerhouse/Documents/GitHub/Project-ScIRank/Scout/test_data/test_pdfs/oligomeric_renal_bovine.pdf"
parsePDF(path).then(function(data) {
    console.log(data);
}).catch();

