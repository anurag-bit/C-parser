const Parser = require('tree-sitter');
const C = require('tree-sitter-c');
const fs = require('fs');
const { Readable } = require('stream');
const path = require('path');

const parser = new Parser();
parser.setLanguage(C);

const codebasePath = './codebase'; // Path to the codebase directory
const CHUNK_SIZE = 10000; // Define the chunk size

function processFile(filePath) {
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    let sourceCode = '';

    fileStream.on('data', (chunk) => {
        sourceCode += chunk;

        if (sourceCode.length >= CHUNK_SIZE) {
            const codeChunk = sourceCode.slice(0, CHUNK_SIZE);
            sourceCode = sourceCode.slice(CHUNK_SIZE);

            const tree = parser.parse(codeChunk);
            console.log(tree.rootNode.toString()); // Output the CST
        }
    });

    fileStream.on('end', () => {
        if (sourceCode.length > 0) {
            const tree = parser.parse(sourceCode);
            console.log(tree.rootNode.toString()); // Output the CST
        }
    });
}

function processCodebase(codebasePath) {
    fs.readdir(codebasePath, (err, files) => {
        if (err) {
            console.error('Error reading codebase directory:', err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(codebasePath, file);
            processFile(filePath);
        });
    });
}

processCodebase(codebasePath);
