// Declare all Imports
const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const { createWorker } = require('tesseract.js');

const worker = createWorker();

// Declare all Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).single('Avatar');

// Declare the View Engine
app.set('view engine', 'ejs');

// Declare the Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/upload', (req, res) => {
    upload(req, res, err => {
        fs.readFile(`./uploads/${req.file.originalname}`, (err, data) => {
            if (err) return console.log('This is your Error', err);

            worker
                .recognize(data, 'eng', { testjs_create_pdf: '1' })
                .progress(progress => console.log(progress))
                // .then(result => res.send(result.text))
                .then(result => res.redirect('/download'))
                .finally(() => worker.terminate())
        });
    });
});


const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Server running on Port : ${PORT}`)); 