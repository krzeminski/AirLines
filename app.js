//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let searchedFlights = [];

app.get("/", function(req,res){
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
