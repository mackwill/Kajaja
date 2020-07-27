/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/listings", (req, res) => {
    // let query = `SELECT * FROM listings`;
    // console.log(`SELECT * FROM listings`);
    db.query(`SELECT * FROM listings`)
      .then((data) => {
        const widgets = data.rows;
        console.log(widgets);
        // res.json({ widgets });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
