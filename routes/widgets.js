/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/listings/:id", (req, res) => {
    const values = [req.params.id];
    db.query(`SELECT * FROM listings WHERE id = $1;`, values)
      .then((data) => {
        const widgets = data.rows;
        console.log(widgets);
        res.render("single_listing", { listing: data.rows[0] });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/listings", (req, res) => {
    db.query(`SELECT * FROM listings;`)
      .then((data) => {
        const widgets = data.rows;
        console.log(widgets);
        res.render("listings", { listings: data.rows });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
