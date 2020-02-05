const { Pool, Client }  = require('pg');


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'DB_PROJ_KRZEMINSKI_SABADACH',
  password: 'admin',
  port: 5432,
});

const client = new Client({
 user: 'postgres',
 host: 'localhost',
 database: 'DB_PROJ_KRZEMINSKI_SABADACH',
 password: 'admin',
 port: 5432,
});

client.connect()


//******************************************************* GETTERY*********************************************************

async function getSourceCities(){
  let cities;

  function getCity(){
    const query = {
      text: 'SELECT DISTINCT source_city FROM flight ORDER BY source_city ASC',
      rowMode: 'array',
    }
    return new Promise((resolve,reject) => {
      client.query(query, (error, res) => {
         if (error) {
           console.log("Błąd w getSourceCities", error);
           reject(error)
         }else{
           cities = res.rows;
           return resolve(cities);
         }

       });
     });
   }

  return await getCity();
};


async function getDestCities(){
  let cities;

  function getCity(){
    const query = {
      text: 'SELECT DISTINCT dest_city FROM flight ORDER BY dest_city ASC',
      rowMode: 'array',
    }
    return new Promise((resolve,reject) => {
      client.query(query, (error, res) => {
         if (error) {
           console.log("Błąd w getSourceCities", error);
           reject(error)
         }else{
           cities = res.rows;
           return resolve(cities);
         }
         // client.end();
       });
     });
   }

  return await getCity();
};


function getFlights(flight){
  const query = {
    text: 'SELECT a.name, b.model, f.source_city, f.dest_city, f.flight_date, f.departure_time, f.arrival_time FROM airline a, aircraft b, flight f WHERE f.source_city= $1 and f.dest_city= $2 and f.flight_date= $3 and f.airline_id=a.airline_id and f.aircraft_id=b.aircraft_id;',
    values: [flight.origin, flight.destination, flight.departure],
    rowMode: 'array',
  }

  return new Promise((resolve,reject) => {
    client.query(query, async (error, res) => {
     if (error) {
       console.log("Błąd w getFlights", error);
       reject(error)
     }else{
       if(res.rows.length != 0){
         console.log("get flight query", res.rows);
         resolve(res.rows);
       }else{
         console.log("Nie ma takich lotów", res.rows);
         resolve(res.rows);
       }
     }

    });
  });
}


function getFlightsByDate(flight){
  const query = {
    text: 'SELECT a.name, b.model, f.source_city, f.dest_city, f.flight_date, f.departure_time, f.arrival_time FROM airline a, aircraft b, flight f WHERE f.flight_date= $1 and f.airline_id=a.airline_id and f.aircraft_id=b.aircraft_id;',
    values: [flight.departure],
    rowMode: 'array',
  }

  return new Promise((resolve,reject) => {
    client.query(query, async (error, res) => {
     if (error) {
       console.log("Błąd w getFlightsByDate", error);
       reject(error)
     }else{
       if(res.rows.length != 0){
         console.log("get flightByDate query", res.rows);
         resolve(res.rows);
       }else{
         console.log("Nie ma takich lotów", res.rows);
         resolve(res.rows);
       }
     }

    });
  });
}


async function getUsers(){

  function getAll(){
    const query = {
      text: 'SELECT * FROM passenger ORDER BY passenger_id ASC',
    }
    return new Promise((resolve,reject) => {
      client.query(query, (error, res) => {
         if (error) {
           console.log("Błąd w pobieraniu użytkowników", error);
           reject(error)
         }else{
           return resolve(res.rows);
         }

       });
     });
   }

  return await getAll();
};


const getUserById = async (request, response) => {
  const id = parseInt(request.params.id)
  function getOne(id){
    const query = {
      text: 'SELECT * FROM passenger WHERE passenger_id = $1',
      values:  [id],
    }
    return new Promise((resolve,reject) => {
      client.query(query, (error, res) => {
         if (error) {
           console.log("Błąd w pobieraniu użytkownika", error);
           reject(error)
         }else{
           return resolve(res.rows);
         }

       });
     });
   }

  return await getOne(id);
};

//**************************************************POST***************************************************
function createAccount(account){
  client.query('INSERT INTO passenger (first_name, last_name, password, email, phone) VALUES ($1, $2, $3, $4, $5);',
   [account.name, account.last_name, account.password, account.email, account.phone], (err,res) => {
  	if (err) {
      console.log("Błąd w createAccount", err);
    }else{
      console.log('Account created!');
    }
  })
};


//********************************************************PUT*********************************************
const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const password = request.body.password;

  client.query(
    'UPDATE passenger SET password = $1 WHERE passenger_id = $2',
    [password, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.redirect("/users");

    }
  )
}


//*************************************************DELETE******************************************************
async function deleteUser(request, response){
  const id = parseInt(request.params.id)

  function deleteThis(id){
    return new Promise((resolve,reject) => {
      pool.query('DELETE FROM passenger WHERE passenger_id = $1', [id], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(response.redirect("/users"));

      })
    });
  }

  return await deleteThis(id);
}



module.exports = {
  getSourceCities,
  getDestCities,
  getFlights,
  getFlightsByDate,
  createAccount,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
}