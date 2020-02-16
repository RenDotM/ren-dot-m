const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const port = process.argv.slice(2)[0];
app = express();
app.use(bodyParser.json());

let houses = [
  {
    id: '1',
    address: {
      street: '123 Abcd RD',
      city: 'Atlanta',
      state: 'GA',
      zip: '30092'
    },
    landlord_id: 1,
    name: 'Sweet Home',
    tenant_ids: [1,2,3]
  },
  {
    id: '2',
    address: {
      street: '456 Efgh Blvd',
      city: 'Round Rock',
      state: 'TX',
      zip: '78664'
    },
    landlord_id: 2,
    name: 'Howdy Home',
    tenant_ids: [4,5,6]
  }
];

app.get('/houses', (req, res) => {
  console.log('Returning houses list');
  res.send(houses);
});

app.get("/houses/:id", (req, res) => {
   const houseId = req.params.id;
   const house = houses.find(_house => _house.id === houseId);
   
   if (house) {
      res.send(house);
   } else {
      res.send({ message: `house ${houseId} doesn't exist`})
   }
});


app.post("/houses", (req, res) => {
   const house = req.body;
   console.log('Adding new item: ', house);

   // add new item to array
   houses.push(house)

   // return updated list
   res.send(houses);
});

// update a house
app.put("/houses/:id", (req, res) => {
   const houseId = req.params.id;
   const houseBody = req.body;
   console.log("Editing item: ", houseId, " to be ", houseBody);

   const updatedListItems = [];
   // loop through list to find and replace one item
   houses.forEach(oldItem => {
      if (oldItem.id === houseId) {
         updatedListItems.push(houseBody);
      } else {
         updatedListItems.push(oldItem);
      }
   });

   // replace old list with new one
   houses = updatedListItems;
   console.log(updatedListItems);

   res.json(houses);
});

// delete a house from list
app.delete("/houses/:id", (req, res) => {
   const houseId = req.params.id;

   console.log("Delete item with id: ", houseId);

   // filter list copy, by excluding item to delete
   const filtered_list = houses.filter(item => item.id !== houseId);

   // replace old list with new one
   houses = filtered_list;

   res.send(houses);
});

console.log(`House service listening on port ${port}`);
app.listen(port);