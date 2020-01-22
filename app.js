//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const db = require('./queries')

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



// let sourceCities = [];
let airway = [];



app.get("/", async function(req,res){
  const sourceCities = await db.getSourceCities();
  console.log(sourceCities);

  sourceCities.forEach(element =>{
     airway.push({
       src: element,
       dest: db.getDestCities(element)
     });
   });

  res.render("home", {airway: airway});
});


app.get("/flights", function(req,res){
  res.render("flights");
});

app.post("/flights", function(req,res){
  let flight = {
    origin:req.body.origin,
    destination:req.body.destination,
    departure:req.body.departure,
    return:req.body.return,
    passengers:req.body.passengers
  };

  console.log(flight);

  db.getFlights(flight);

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

// //Te wywołują funkcje z queries pod localhost:3000/users...
// app.get('/users', db.getUsers)
// app.get('/users/:id', db.getUserById)
// app.post('/users', db.createUser)
// app.put('/users/:id', db.updateUser)
// app.delete('/users/:id', db.deleteUser)
