const express = require("express");
const path = require("path");

const app = express();

const publicDirectoryPath = path.join(__dirname, "../public");
const PORT = process.env.PORT || 3000;

app.use(express.static(publicDirectoryPath));

app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});
