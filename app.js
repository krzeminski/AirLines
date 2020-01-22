//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const db = require('./queries')
const { Pool, Client }  = require('pg');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const pool = new Pool({
  user: 'adrian',
  host: 'localhost',
  database: 'wiadro',
  password: 'admin',
  port: 5432,
});

const client = new Client({
 user: 'postgres',
 host: 'localhost',
 database: 'wiadro',
 password: 'admin',
 port: 5432,
});
client.connect()


let searchedFlights = [];

app.get("/", function(req,res){

  //creme de la creme
  client.query('SELECT DISTINCT source_city FROM flight ORDER BY source_city ASC', (error, results) => {
    if (error) {
      console.log(error);
    }else{
      console.log(results.rows);
    }
    client.end();
  });


  res.render("home");
});

app.get("/flights", function(req,res){
  res.render("flights");
});

app.get("/sign-in", function(req,res){
  res.render("sign-in");
});

app.get("/sign-up", function(req,res){
  res.render("sign-up");
});

//Te wywołują funkcje z queries pod localhost:3000/users...
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)


app.post("/", function(req,res){
  let flight = {
    origin:req.body.origin,
    destination:req.body.destination,
    departure:req.body.departure,
    return:req.body.return,
    passengers:req.body.passengers
  };
  searchedFlights.push(flight);
  res.redirect("/");
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
