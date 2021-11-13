/* File for all routes around batting statistics */
let express = require('express'),
    router = express.Router(),
    pool = require("../DB.js");

/*
    Top career run-scorers
    Firstly we'll do this as a query and then we'll use a procedure
 */
router.get("/CareerRuns/:count", async function(req, res){

    try {
        const { count } = req.params;
        const q = `SELECT D.playerid, D.Playername, B.runs FROM players.batting B
        INNER JOIN Players.Details D ON D.PlayerId = B.PlayerId
        WHERE year IS NULL ORDER BY runs DESC LIMIT ${count}`;

        const todos = await pool.query(q);
        res.json(todos);
        console.log("Retrieved from players.batting")

    } catch (err) {
        console.error(err.message);
    }
});

/*
    Top career high scores
    Again we will replace this with a procedure, need to return the player name as well I assume
 */
router.get("/CareerHighScores/:count", async function(req, res){

    try {
        const { count } = req.params;
        const q = `SELECT D.playerid, D.playername, B.Highscore FROM players.batting B
                        INNER JOIN players.details D ON D.playerid = B.playerid
                   WHERE year IS NULL
                   ORDER BY Highscore DESC
                   LIMIT ${count}`;
        const todos = await pool.query(q);
        res.json(todos);
        console.log("Retrieved from players.batting")

    } catch (err) {
        console.error(err.message);
    }
});

/*
    Top career average
    Again we will replace this with a procedure, need to return the player name as well I assume
 */
router.get("/CareerAverage/:count", async function(req, res){

    try {
        const { count } = req.params;
        const q = `SELECT D.playerid, D.playername, B.average FROM players.batting B
                    INNER JOIN players.details D ON D.playerid = B.playerid 
                    WHERE year IS NULL AND average IS NOT NULL AND innings > 10
                    ORDER BY average DESC 
                    LIMIT ${count}`;
        const todos = await pool.query(q);
        res.json(todos);
        console.log("Retrieved from players.batting")

    } catch (err) {
        console.error(err.message);
    }
});

/*
    Top career century count
    Again we will replace this with a procedure, need to return the player name as well I assume
 */
router.get("/CareerCenturies/:count", async function(req, res){

    try {
        const { count } = req.params;
        const q =   `SELECT D.playerid, D.playername, B.hundreds AS centuries FROM players.batting B
                        INNER JOIN players.details D ON D.playerid = B.playerid
                    WHERE year IS NULL
                    ORDER BY B.hundreds DESC
                    LIMIT ${count}`;

        const todos = await pool.query(q);
        res.json(todos);
        console.log("Retrieved from players.batting")

    } catch (err) {
        console.error(err.message);
    }
});

/*
    Highest average by season
    parameters are season and count -> into function/procedure
 */
router.get("/SeasonAverage/:season/:count", async function(req, res){

    try {
        const { season, count } = req.params;
        const q = `SELECT * FROM players.batting WHERE year = ${season} AND Average IS NOT NULL ORDER BY Average DESC LIMIT ${count}`;
        console.log(q);
        const todos = await pool.query(q);
        res.json(todos);
        console.log("Retrieved from players.batting")

    } catch (err) {
        console.error(err.message);
    }
});

/*
    Get career batting stats by player id
 */
router.get("/career/:id", async function(req, res){

    try {
        // If it can be parsed then go by id, otherwise name
        const { id } = req.params;

        let r = parseInt(id) || id;

        let q;
        if (r === parseInt(r, 10)) {
            q = `SELECT * FROM players.batting WHERE year IS NULL AND playerid = ${r}`;
        } else {
            q = `SELECT * FROM players.batting B 
            INNER JOIN Players.Details D ON D.PlayerId = B.PlayerId 
            WHERE year IS NULL AND D.playername LIKE '${r.toString()}'`;
        }

        const todos = await pool.query(q);
        res.json(todos);
        console.log(`Retrieved career stats from summary.bowlingseason for player ${r}`)

    } catch (err) {
        console.error(err.message);
    }
});

/*
    Get career batting stats by player id
 */
router.get("/seasons/:id", async function(req, res){

    try {
        // If it can be parsed then go by id, otherwise name
        const { id } = req.params;

        const q = `SELECT B.battingid AS id, * FROM players.batting B
        INNER JOIN Players.Details D ON D.PlayerId = B.PlayerId
        WHERE year IS NOT NULL AND B.playerid = ${id}`;

        const todos = await pool.query(q);
        res.json(todos);
        console.log(`Retrieved season stats from summary.battingseason for player ${id}`)

    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;