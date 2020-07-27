/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const database = require("../database");

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

  router.get("/create-listing", (req, res) => {
    res.render("create_listing_page");
  });

  router.post("/create-listing", (req, res) => {
    const listing = req.body;
    listing.owner_id = req.session.userId;
    database
      .createNewListing(listing)
      .then((listing) => {
        res.redirect(`/api/widgets/listings/${listing.id}`);
      })
      .catch((e) => res.render("create_listing_page"));
  });

  return router;
};
