const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const DatabaseFactory = require('./db/DatbaseConnection');

const app = express();
app.use(bodyParser.json());

const config = require('config');
let appPort = config.get('app.port');
let dpType = config.get('db.type');

const db = DatabaseFactory.createDB(dpType);

app.post("/users", (req, res) => {
   const user = req.body;
   console.log('Adding new item: ', user);

   res.send(db.createUser(user));
});

app.get('/users', (req, res) => {
  console.log('Returning users list');

  res.send(db.getUsers());
});

app.get("/users/:id", (req, res) => {
   const userId = req.params.id;
   const user = db.getUserById(userId)

   if (user) {
      res.json(user);
   } else {
      res.json({ message: `user ${userId} doesn't exist`})
   }
});

app.put("/users/:id", (req, res) => {
   const userId = req.params.id;
   const content = req.body;

   res.send(db.updateUserById(userId, content));
});

app.delete("/users/:id", (req, res) => {
   const userId = req.params.id;

   console.log("Delete item with id: ", userId);

   res.send(db.deleteUserById(userId));
});

console.log(`User service listening on port ${appPort}`);

app.listen(appPort);
