const { Pool } = require("pg");

const pool = new Pool({

host: "database-1.chmgqe0e2heu.ap-south-1.rds.amazonaws.com",
  port: 5432,
  user: "postgres",
  password: "Aadhav123!",
  database: "postgres",
ssl:{
rejectUnauthorized:false
}

});

module.exports = pool;