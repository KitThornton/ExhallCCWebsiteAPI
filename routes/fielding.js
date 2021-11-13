/* File for all routes around fielding statistics */
let express = require('express'),
    router = express.Router(),
    pool = require("../DB.js");

router.get("/CareerCatches/:count", async function(req, res){

    try {
        const { count } = req.params;
        const q = `SELECT * FROM players.fielding
                   WHERE year IS NULL
                   ORDER BY Catches DESC LIMIT ${count}`;
        const todos = await pool.query(q);
        res.json(todos);
        console.log("Retrieved from players.fielding")

    } catch (err) {
        console.error(err.message);
    }
});

router.get("/CareerStumpings/:count", async function(req, res){

    try {
        const { count } = req.params;
        const q = `SELECT * FROM players.fielding
                   WHERE year IS NULL
                   ORDER BY Stumpings DESC LIMIT ${count}`;
        const todos = await pool.query(q);
        res.json(todos);
        console.log("Retrieved from players.fielding")

    } catch (err) {
        console.error(err.message);
    }
});

router.get("/CareerDismissals/:count", async function(req, res){

    try {
        const { count } = req.params;
        const q = `SELECT COALESCE(Catches, 0) + COALESCE(Stumpings, 0) AS DISMISSALS, F.PlayerId, D.PlayerName FROM players.fielding F
                    INNER JOIN Players.Details D ON D.PlayerId = F.PlayerId
                   WHERE year IS NULL
                   ORDER BY DISMISSALS DESC LIMIT ${count}`;
        const todos = await pool.query(q);
        res.json(todos);
        console.log("Retrieved from players.fielding")

    } catch (err) {
        console.error(err.message);
    }
});

router.get("/seasons/:id", async function(req, res){

    try {
        const { id } = req.params;

        const q = `SELECT F.fieldingid AS id, COALESCE(F.Catches, 0) + COALESCE(F.Stumpings, 0) AS dismissals, * FROM players.fielding F
        INNER JOIN Players.Details D ON D.PlayerId = F.PlayerId
        WHERE year IS NOT NULL AND F.playerid = ${id}`;

        const todos = await pool.query(q);
        res.json(todos);
        console.log("Retrieved from players.fielding")

    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;

