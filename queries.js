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
         client.end();
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
         client.end();
       });
     });
   }

  return await getCity();
};

// async function getDestCities(sourceCity){
//   let cities;
//
//   function getCity(){
//     const query = {
//     	text: 'SELECT DISTINCT dest_city FROM flight where source_city = $1::text ORDER BY dest_city ASC;',
//     	values: [sourceCity],
//       rowMode: 'array',
//     }
//     return new Promise((resolve,reject) => {
//       client.query(query, (error, res) => {
//          if (error) {
//            console.log("Błąd w getSourceCities", error);
//            reject(error)
//          }else{
//            cities = res.rows;
//            return resolve(cities);
//          }
//          client.end();
//        });
//      });
//    }
//
//   return await getCity();
// };


function getAirway(){

}

function getFlights(flight){
  const query = {
    text: 'SELECT a.name, b.model, f.source_city, f.dest_city, f.flight_date, f.departure_time, f.arrival_time FROM airline a, aircraft b, flight f WHERE f.source_city= $1 and f.dest_city= $2 and f.flight_date= $3 and f.airline_id=a.airline_id and f.aircraft_id=b.aircraft_id;',
    // text: 'SELECT a.name, b.model, f.source_city, f.dest_city, f.flight_date, f.departure_time, f.arrival_time FROM airline a, aircraft b, flight f WHERE f.source_city= $1 and f.dest_city= $2 and f.airline_id=a.airline_id and f.aircraft_id=b.aircraft_id;',
    values: [flight.origin, flight.destination, flight.departure],
    // values: [flight.origin, flight.destination],
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
     //console.log(response.status(200).json(res.rows));

     await client.end();
    });
  });
}


// function getFlights(flight){
  // const query = {
    // text: 'SELECT a.name, b.model, f.source_city, f.dest_city, f.flight_date, f.departure_time, f.arrival_time FROM airline a, aircraft b, flight f WHERE f.source_city= $1 and f.dest_city= $2 and f.flight_date= $3 and f.airline_id=a.airline_id and f.aircraft_id=b.aircraft_id;',
    // text: 'SELECT a.name, b.model, f.source_city, f.dest_city, f.flight_date, f.departure_time, f.arrival_time FROM airline a, aircraft b, flight f WHERE f.source_city= $1 and f.dest_city= $2 and f.airline_id=a.airline_id and f.aircraft_id=b.aircraft_id;',
    // values: [flight.origin, flight.destination, flight.departure],
    // values: [flight.origin, flight.destination],
    // rowMode: 'array',
  // }

  // client
    // .query(query)
    // .then(res => {
     // if(res.rows.length != 0){
       // console.log("get flight query", res.rows);
       // return res.rows;
     // }else{
       // console.log("Nie ma takich lotów", res.rows);
       // return res.rows;
     // }
   // })
   // .catch(e => console.error(e.stack));
// }




// function getFlights(flight){
//   let foundFlight;
//   client.query('SELECT a.name, b.model, f.source_city, f.dest_city, f.flight_date, f.departure_time, f.arrival_time FROM airline a, aircraft b, flight f WHERE f.source_city=$1 and f.dest_city=$2 and f.flight_date=$3 and f.airline_id=a.airline_id and f.aircraft_id=b.aircraft_id;',
//    [flight.origin, flight.destination, flight.departure], (err, res) => {
//     if (err) {
//       console.log("Błąd w getFlights", err);
//     }else{
//       console.log(res.rows);
//       return res.rows;
//     }
//     //response.status(200).json(results.rows);
//     client.end();
//   });
// };
//


function createAccount(account){
  client.query('INSERT INTO passenger (first_name, last_name, password, email, phone) VALUES ($1, $2, $3, $4, $5);',
   [account.name, account.last_name, account.password, account.email, account.phone], (err,res) => {
  	if (err) {
      console.log("Błąd w createAccount", err);
    }else{
      console.log('Account created!');
    }
    client.end();
  })
};

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
};

const createUser = (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${result.insertId}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getSourceCities,
  getDestCities,
  getFlights,
  createAccount,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}
