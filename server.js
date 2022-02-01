const fs = require("fs");
const express = require("express");
const path = require("path");
var uniqid = require('uniqid');
const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require("./public/scripts/fsUtils");

const PORT = process.env.PORT || 3001;

const app = express();

//Middleware 
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static("public"));

// GET Route for getting notes
app.get("/notes", (req, res) =>
    res.sendFile(path.join(__dirname, "/public/notes.html"))
);

//GET route for getting notes from our database
app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});


//POST Route for new notes
app.post("/api/notes", (req, res) => {
    const {
        title,
        text,
        id
    } = req.body;
    console.log(req.body);

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uniqid()
        };

        readAndAppend(newNote, "./db/db.json");
    }
});

// GET route for getting specific notes by id
app.get('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((note) => note.id === noteId);
            return result.length > 0 ?
                res.json(result) :
                res.json('No note with that ID');
        });
});

// DELETE Route for a specific note
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            // Make a new array of all tips except the one with the ID provided in the URL
            const result = json.filter((note) => note.id !== noteId);

            // Save that array to the filesystem
            writeToFile('./db/db.json', result);

            // Respond to the DELETE request
            res.json(`Item ${noteId} has been deleted 🗑️`);
        });
});

//GET route to send all non-specified routes to landing page 
app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));