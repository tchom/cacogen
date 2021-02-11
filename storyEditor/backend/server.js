const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// create application/json parser
const jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const cors = require('cors');
const port = 3000

const app = express();
app.use(cors());

const fs = require('fs')

const storeData = (data, path) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}

app.get('/storylist', function (req, res) {
    /*res.type('text/plain');
    res.write('Hello!')
    res.end();
    storeData({ x: "foo" }, '../../data/bar.json');*/
    const dataDir = '../data';
    // let rawdata = fs.readFileSync('../../data/bar.json');

    const response = {
        list: []
    };
    fs.readdirSync(dataDir).forEach(file => {
        response.list.push({
            "id": file.split('.').slice(0, -1).join('.'),
            "name": file
        });
    });

    //let bar = JSON.parse(response);

    res.type('json');
    res.write(JSON.stringify(response))
    res.end();

});


app.post('/createStory', jsonParser, function (req, res) {
    console.log(req.body);
    res.type('text/plain');
    res.end();
    storeData({ entry: {} }, `../data/${req.body.storyName}.json`);
});

app.post('/deleteStory', jsonParser, function (req, res) {
    console.log(req.body);
    res.type('text/plain');
    res.end();

    const path = `../data/${req.body.storyName}.json`;

    try {
        fs.unlinkSync(path)
        //file removed
    } catch (err) {
        console.error(err)
    }
});

app.get('/storyNode', function (req, res) {
    const storyId = req.query.storyId;
    const dataDir = '../data/' + storyId + '.json';

    console.log(dataDir);

    const rawdata = fs.readFileSync(dataDir, 'utf8');

    res.type('json');
    const dataJson = JSON.parse(rawdata);
    res.write(JSON.stringify(dataJson.nodes));
    res.end();

});

app.post('/saveStory', jsonParser, function (req, res) {
    console.log(req.body);
    res.type('text/plain');
    res.end();

    const path = `../data/${req.body.id}.json`;


    try {
        const storyJson = {
            "nodes": {

            }
        };
        for (const data of req.body.data) {
            storyJson.nodes[data.id] = data.data;
        }

        storeData(storyJson, path);
        //file removed
    } catch (err) {
        console.error(err)
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})