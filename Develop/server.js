const express = require('express');
const fs = require('fs');
const path = require('path');
const { readNotes, writeNotes } = require('./helpers/readAndWrite.js')
const uuidv1 = require('uuid/v1');

const PORT = 3001;
const app = express();
//At the top, we are declaring the port 3001

//Routes:
//This tells the server to look in the public folder when it tries to find and send index.html
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//This route sends the index.html file when the user goes to http://localhost:3001 without an additional URL path
app.get('/', (req, res) => {
    console.log(req.query)
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'))
});

//this does not work with res.json... its already a json file so maybe thats why
// app.get('/notes', (req, res) => {
//     res.sendFile(path.join(__dirname, 'db', 'db.json'))
// });
//alternative option to send as json?
app.get('/api/notes', async(req, res) => {
    try {
        const notes = await readNotes();
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.sendStatus(500).send('Server had an error getting notes');
    }
});
// app.get('/api/notes', (req, res) => {
//     fs.readFile(path.join(__dirname, 'db', 'db.json'), (err, data) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send('Servor had an error getting notes');
//         } else {
//             const notes = JSON.parse(data);
//             res.json(notes);
//         }
//     });
// });

// This wildcard will return the index.html file for any get request that doesnt match a defined route. 
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

//
app.post('/api/notes', async(req, res) => {

  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
        title,
        text,
        id: uuidv1(),
    };
    console.log(newNote);
    try {
        const existingNotes = await readNotes();
        existingNotes.push(newNote);
        await writeNotes(existingNotes)
        res.json('Note saved!');
    } catch (error) {
        console.error(error);
        res.status(500).json('Failed to save note.');
    }
} else {
    res.status(400).json('Title AND text are required!');
}
});
//     fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (error, existingNotes) => {
//         if (error) throw error;
//   const existingNotesArr = JSON.parse(existingNotes);
//   console.log(existingNotesArr);
//   existingNotesArr.push(newNote);
   
//     fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(existingNotesArr) + '\n', (err) => {
//         console.log(existingNotesArr);
//         if (err) {
//     console.log(err)
//     res.status(500).json("Failed to save note.");

//         } else {
//     res.json('Note saved!');
//         }
//     });
// });
// }
//          else {
//     res.status(400).json("Title and text are required");
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });