// Declare all Imports
const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const { createWorker } = require('tesseract.js');

const worker = createWorker({
    logger: (m) => console.log(m),
  });

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
app.use(express.static(__dirname + '/public'));

// Declare the Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/upload', (req, res) => {
    upload(req, res, err => {
        fs.readFile(`./uploads/${req.file}`, (err, data) => {
            if(err) return console.log('Error:', err);

            worker.recognize(data, 'eng', {
                test_create_pdf: '1'
            }).process(process => console.log(process)).then(result => res.send(result.text)).finally(() => worker.terminate())
            // (async () => {
            //     await worker.load();
            //     await worker.loadLanguage('eng');
            //     await worker.initialize('eng');
            //     const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
            //     console.log(text);
            //     await worker.terminate();
            //   })();

        });
    });
});

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Server running on Port : ${PORT}`)); 