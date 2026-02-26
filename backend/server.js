const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

/* ================= HOME ================= */

app.get("/", (req, res) => {
  res.send("🦇 BATCOM Backend Online — Gotham Protected");
});