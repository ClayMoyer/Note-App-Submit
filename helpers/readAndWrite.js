const fs = require('fs');
const path = require('path');

function readNotes() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '..', 'db', 'db.json'), 'utf-8', (error, existingNotes) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(existingNotes));
                // console.log(existingNotes);
            }
        });
    });
}

function writeNotes(existingNotesArr) {
    return new Promise((resolve, error) => {
        fs.writeFile(path.join(__dirname, '..', 'db', 'db.json'), JSON.stringify(existingNotesArr, null, 2) + '\n', (error) => {
            // console.log(existingNotesArr);
            if (error) {
                console.log(error)
                res.status(500).json('Failed to save note.');
            } else {
                resolve();
            }
        });
    });
    }

module.exports = { readNotes, writeNotes };