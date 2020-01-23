//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const db = require('./queries')

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



let sourceCities = [];
let destCities = [];
let airway;
let table;
let searchedFlight;

db.getSourceCities()
  .then(function(res){sourceCities=res;})
  .catch(function(err) {
      console.log('error: ', err);
  });

db.getDestCities()
  .then(function(res){destCities=res;})
  .catch(function(err) {
      console.log('error: ', err);
  });


app.get("/", async function(req,res){
  searchedFlight = null;
   airway = {
     src: sourceCities,
     dest: destCities
   };

  res.render("home", {airway: airway});
});



app.get("/flights", async function(req,res){
  console.log("get searchedFlight", searchedFlight);
  // console.log(typeof(searchedFlight.origin));
  foundFlights = await db.getFlights(searchedFlight);
  let isFlight = 1;
  if(foundFlights.length == 0){
    isFlight = 0;
  }
  res.render("flights", {foundFlights:foundFlights, isFlight:isFlight}	);
});

app.post("/flights", async function(req,res){
  let flight = {
    origin:req.body.origin,
    destination:req.body.destination,
    departure:req.body.departure,
    return:req.body.return,
    passengers:req.body.passengers
  };

  console.log("flight:", flight);
  searchedFlight = flight;

  res.redirect("/flights");
});

app.get("/sign-in", function(req,res){
  res.render("sign-in");
});

app.get("/sign-up", function(req,res){
  res.render("sign-up");
});

app.post("/sign-up", function(req,res){
  let account = {
    name: req.body.name,
    last_name: req.body.surname,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone
  }

  db.createAccount(account);

  res.render("sign-in");
});

//Te wywołują funkcje z queries pod localhost:3000/users...
app.get('/users', function(req,res){
  let users=db.getUsers();

  res.render("users", {users:users});
});

app.get('/users/:id', function(req,res){
  let users=db.getUserById();

  res.render("users", {users:users});
});
// app.post('/users', db.createUser)


app.put('/users/:id', function(req,res){
  db.updateUser();

  res.redirect("users");
});

app.delete('/users/:id', db.deleteUser)

app.delete('/users/:id', function(req,res){
  db.deleteUser();
  res.redirect("users");
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
