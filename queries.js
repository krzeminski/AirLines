const { Pool, Client }  = require('pg');

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

function getSourceCities(){
  //creme de la creme
  client.query('SELECT DISTINCT source_city FROM flight ORDER BY source_city ASC', (err, res) => {
    if (err) {
      console.log("Błąd w getSourceCities", err);
    }else{
      // console.log(res.rows);
      return res.rows;
    }
    client.end();
  });
};

function getDestCities(){
  client.query('SELECT dest_city FROM flight ORDER BY dest_city ASC;', (err, res) => {
    if (err) {
      console.log("Błąd w getDestCities",err);
    }else{
      console.log(res.rows);
      return res.rows;
    }
    //response.status(200).json(results.rows);
    client.end();
  })
};

function getAirway(){

}

function getFlights(flight){
  let foundFlight;
  client.query('SELECT a.name, b.model, f.source_city, f.dest_city, f.flight_date, f.departure_time, f.arrival_time FROM airline a, aircraft b, flight f WHERE f.source_city=$1 and f.dest_city=$2 and f.flight_date=$3 and f.airline_id=a.airline_id and f.aircraft_id=b.aircraft_id;',
   [flight.origin, flight.destination, flight.departure], (err, res) => {
    if (err) {
      console.log("Błąd w getFlights", err);
    }else{
      console.log(res.rows);
      foundFlight = res.rows;
    }
    //response.status(200).json(results.rows);
    client.end();
  });
};



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




module.exports = {
  getSourceCities,
  getDestCities,
  getFlights,
  createAccount,
}
























// -----------------------------------------------------


// const getUsers = (request, response) => {
//   pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
//     if (error) {
//       throw error
//     }
//     response.status(200).json(results.rows)
//   })
// };
//
// const getUserById = (request, response) => {
//   const id = parseInt(request.params.id)
//
//   pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
//     if (error) {
//       throw error
//     }
//     response.status(200).json(results.rows)
//   })
// };
//
// const createUser = (request, response) => {
//   const { name, email } = request.body
//
//   pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
//     if (error) {
//       throw error
//     }
//     response.status(201).send(`User added with ID: ${result.insertId}`)
//   })
// }
//
// const updateUser = (request, response) => {
//   const id = parseInt(request.params.id)
//   const { name, email } = request.body
//
//   pool.query(
//     'UPDATE users SET name = $1, email = $2 WHERE id = $3',
//     [name, email, id],
//     (error, results) => {
//       if (error) {
//         throw error
//       }
//       response.status(200).send(`User modified with ID: ${id}`)
//     }
//   )
// }
//
// const deleteUser = (request, response) => {
//   const id = parseInt(request.params.id)
//
//   pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
//     if (error) {
//       throw error
//     }
//     response.status(200).send(`User deleted with ID: ${id}`)
//   })
// }
//
// module.exports = {
//   getSourceCities,
//   getDestCities,
//   getUsers,
//   getUserById,
//   createUser,
//   updateUser,
//   deleteUser,
// }
