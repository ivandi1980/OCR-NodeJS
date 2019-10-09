const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
// const { tesseract }


const storage = multer.diskStorage({
    destination: (req, res, callback) => {
        callback(null, './uploads');
    },
    filename: (req, res, callback) => {
        callback(null, req.file);
    }
});

const upload = multer({ storage: storage}).single('Avatar');

app.set('view engine', 'ejs');
// app.get('/upload', (req, res) => {

// })
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Server running on Port : ${PORT}`)); 