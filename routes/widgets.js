/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
// const renderListings = require("../public/scripts/listings-render");

module.exports = (db) => {
  router.get("/listings/:id", (req, res) => {
    console.log("res.params", res.params.id);
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
