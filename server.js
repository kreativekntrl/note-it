const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3001;

app.use(express.static('public'));

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));