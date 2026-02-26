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

/* ================= HEALTH CHECK ================= */

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* ================= ADD LOG ================= */

async function addLog(action, details) {
  await pool.query(
    `INSERT INTO crime_logs (timestamp, action, details)
     VALUES (NOW(), $1, $2)`,
    [action, details]
  );
}

/* ================= GET CRIMINALS ================= */
/* Includes sightings + frontend-friendly names */

app.get("/criminals", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.name,
        c.alias,
        c.crime_description AS "crimeDescription",
        c.threat_level AS "threatLevel",
        c.case_status AS "caseStatus",
        c.captured,
        c.terminated,
        COALESCE(
          json_agg(
            json_build_object(
              'location', s.location,
              'date', s.date
            )
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) AS sightings
      FROM criminals c
      LEFT JOIN sightings s
      ON c.id = s.criminal_id
      GROUP BY c.id
      ORDER BY
        CASE c.threat_level
          WHEN 'high' THEN 3
          WHEN 'medium' THEN 2
          ELSE 1
        END DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET LOGS ================= */

app.get("/logs", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM crime_logs
      ORDER BY timestamp DESC
      LIMIT 50
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/logs", async (req, res) => {
  try {
    const { action, details } = req.body;

    await addLog(
      action || "CUSTOM",
      details || "Manual log entry"
    );

    res.json({ message: "Log entry added" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= ADD CRIMINAL ================= */

app.post("/criminals", async (req, res) => {
  try {
    const { name, alias, crimeDescription, threatLevel } = req.body;

    const result = await pool.query(
      `INSERT INTO criminals
       (name, alias, crime_description, threat_level, case_status, captured, terminated)
       VALUES ($1, $2, $3, $4, 'open', false, false)
       RETURNING *`,
      [name, alias, crimeDescription, threatLevel]
    );

    await addLog(
      "ADD",
      `${name}${alias ? ` (${alias})` : ""} added to surveillance`
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});