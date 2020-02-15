const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const port = process.argv.slice(2)[0];
const app = express();
app.use(bodyParser.json());

let data = require('./data/data');

app.get('/maintenance', (req, res) => {
    console.log('Returning maintenance list');
    res.json(data);
});

app.get('/maintenance/:id', (req, res) => {
    console.log('Returning maintenance associated with maintenance_id');
    const maintenanceId = req.params.id;
    const item = data.find(_item => _item.id === maintenanceId);

    if (item) {
        res.json(item);
    } else {
        res.json({ message: `item ${maintenanceId} doesn't exist`})
    }

});

app.post("/maintenance", (req, res) => {
    const item = req.body;
    console.log('Adding new maintenance item: ', item);

    // add new item to array
    data.push(item);

    // return updated list
    res.json(data);
});

app.put("/maintenance/:id", (req, res) => {
    const itemId = req.params.id;
    const item = req.body;
    console.log("Editing item: ", itemId, " to be ", item);

    const updatedListItems = [];
    // loop through list to find and replace one item
    data.forEach(oldItem => {
        if (oldItem.id === itemId) {
            updatedListItems.push(item);
        } else {
            updatedListItems.push(oldItem);
        }
    });

    // replace old list with new one
    data = updatedListItems;

    res.json(data);
});

app.delete("/items/:id", (req, res) => {
    const itemId = req.params.id;

    console.log("Delete item with id: ", itemId);

    // filter list copy, by excluding item to delete
    const filtered_list = data.filter(item => item.id !== itemId);

    // replace old list with new one
    data = filtered_list;

    res.json(data);
});

// app.post('/maintenance/**', (req, res) => {
//     const heroId = parseInt(req.params[0]);
//     const foundHero = maintenances.find(subject => subject.id === heroId);
//
//     if (foundHero) {
//         for (let attribute in foundHero) {
//             if (req.body[attribute]) {
//                 foundHero[attribute] = req.body[attribute];
//                 console.log(`Set ${attribute} to ${req.body[attribute]} in hero: ${heroId}`);
//             }
//         }
//         res.status(202).header({Location: `http://localhost:${port}/hero/${foundHero.id}`}).send(foundHero);
//     } else {
//         console.log(`Hero not found.`);
//         res.status(404).send();
//     }
// });

app.use('/img', express.static(path.join(__dirname,'img')));

console.log(`Heroes service listening on port ${port}`);
app.listen(port);