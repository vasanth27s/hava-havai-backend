const { app } = require('./app.js');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vasanth',
  host: 'localhost',
  database: 'hava-havai-assignment',
  password: 'vasanth123',
  port: 5432, 
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error executing query', err);
  } else {
    console.log('Query result:', res.rows[0]);
  }
  pool.end(); 
});
module.exports = app;
