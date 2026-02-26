const fs=require("fs");

const pool=require("./db");

async function setup(){

const sql = fs.readFileSync(

"./db/schema.sql"

).toString();

await pool.query(sql);

console.log("Tables Created");

process.exit();

}

setup();