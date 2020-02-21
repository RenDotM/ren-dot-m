const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const DatabaseFactory = require('./db/DatbaseConnection');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

const config = require('config');
let appPort = config.get('app.port');
let dpType = config.get('db.type');
console.log('config,appPort,dpType: ', config,appPort,dpType);

const db = DatabaseFactory.createDB(dpType);

app.post("/users", (req, res) => {
  console.log('post("/users" req.body: ', req.body);
  const user = req.body;
  jwt.sign({user}, 'secretkey', (err,access_token) => {
    res.json({user: db.createUser(user), access_token})
    console.log('Adding new item: ', user);
  });
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
   console.log('.put("/users/:id("/users" res: ', req);
   console.log('put("/users/:id("/users" res: ', res);
   const userId = req.params.id;
   const content = req.body;

   res.send(db.updateUserById(userId, content));
});

app.delete("/users/:id", (req, res) => {
   console.log('.delete("/users/:id("/users" res: ', req);
   console.log('delete("/users/:id("/users" res: ', res);
   const userId = req.params.id;

   console.log("Delete item with id: ", userId);

   res.send(db.deleteUserById(userId));
});

app.post("/login", (req, res) => {
   console.log('post("/users" req.body: ', req.body);
   jwt.sign({user:req.body}, 'secretkey', (err,access_token) => {
      res.json({access_token})
   });
});
app.post('/api/posts', verifyToken, (req, res) => {  
   jwt.verify(req.token, 'secretkey', (err, authData) => {
     if(err) {
       res.sendStatus(403);
     } else {
       res.json({
         message: 'Post created...',
         authData
       });
     }
   });
 });

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}
console.log(`User service listening on port ${appPort}`);

app.listen(appPort);
