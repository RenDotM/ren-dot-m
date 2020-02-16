const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const config = require('config');

let appPort = config.get('app.port');

let users = [
  {
      user_id: '1',
      username: 'ck43789@gmail.com',
      password: 'abc123',
      tenants: [1, 2, 3]
  },
  {
      user_id: '2',
      username: 'ppui2567@gmail.com',
      password: 'abc456',
      tenants: [1, 2, 3]
  }
];

app.post("/users", (req, res) => {
   const user = req.body;
   console.log('Adding new item: ', user);

   // add new item to array
   users.push(user)

   // return updated list
   res.send(users);
});

app.get('/users', (req, res) => {
  console.log('Returning users list');
  res.send(users);
});

app.get("/users/:id", (req, res) => {
   const userId = req.params.id;
   const user = users.find(_user => _user.user_id === userId);

   if (user) {
      res.json(user);
   } else {
      res.json({ message: `user ${userId} doesn't exist`})
   }
});

// update an item
app.put("/users/:id", (req, res) => {
   const itemId = req.params.id;
   const item = req.body;

   console.log(itemId)

   console.log(item)

   const updatedListItems = [];
   // loop through list to find and replace one item
   users.forEach(oldItem => {
      if (oldItem.user_id === itemId) {
         updatedListItems.push(item);
      } else {
         updatedListItems.push(oldItem);
      }
   });

   // replace old list with new one
   users = updatedListItems;

   res.send(users);
});

app.delete("/users/:id", (req, res) => {
   const userId = req.params.id;

   console.log("Delete item with id: ", userId);

   // filter list copy, by excluding item to delete
   const filtered_list = users.filter(user => user.user_id !== userId);

   users = filtered_list;

   res.send(users);
});

console.log(`User service listening on port ${appPort}`);

app.listen(appPort);
