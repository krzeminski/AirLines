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
let searchedFlight = {
  origin:"Berlin",
  destination:"Warszawa",
  departure:"23-01-2020",
  return:"24-01-2020",
  passengers:1
};

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
   airway = {
     src: sourceCities,
     dest: destCities
   };

  res.render("home", {airway: airway});
});



app.get("/flights", async function(req,res){
  console.log("get searchedFlight", searchedFlight);
  // console.log(typeof(searchedFlight.origin));
  table = db.getFlights(searchedFlight);
  console.log("get table", table);
  res.render("flights");
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




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
