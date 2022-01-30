const fs = require("fs");
const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3001;

const app = express();

//Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// GET Route for getting notes
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

//GET route to send all non-included routes to landing page 
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
); 

app.listen(PORT, () => console.log(`App listening on port ${PORT}`)); 