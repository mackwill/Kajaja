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
    const templateVars = {}
    const values = [req.params.id];
    db.query(`SELECT * FROM listings WHERE id = $1;`, values)
      .then((data) => {
        templateVars.listing = data.rows[0]

        if(req.session.userId){
           database.getUserWithId(req.session.userId)
          .then(user => {
            templateVars.user = user
            res.render("single_listing", templateVars);
          })
          .catch((e) => {
            templateVars.user = null
            res.render("single_listing", templateVars);
          })
        }else{
        templateVars.user = null
        res.render("single_listing", templateVars);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/listings", (req, res) => {
    const templateVars = {}
    database.getListings(req.query)
      .then((data) => {
        templateVars.listings = data

        if(req.session.userId){
          database.getUserWithId(req.session.userId)
         .then(user => {
           templateVars.user = user
           res.render("listings", templateVars);
         })
         .catch((e) => {
           templateVars.user = null
           res.render("listings", templateVars);
         })
       }else{
       templateVars.user = null
        res.render("listings", templateVars);
       }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/create-listing", (req, res) => {
    if(!req.session.userId){
      req.session.message = 'You need to be logged in to post an ad'
      res.redirect('/api/users/login')
    }else{
    const templateVars = {}
    database.getUserWithId(req.session.userId)
         .then(user => {
           templateVars.user = user
           res.render("create_listing_page", templateVars);
         })
         .catch((e) => {
          templateVars.user = null
          res.render("create_listing_page", templateVars);
         })
    }
  });

  router.post("/create-listing", (req, res) => {
    const listing = req.body;
    listing.owner_id = req.session.userId;
    console.log("Im here:", listing);

    database
      .createNewListing(listing)
      .then((listing) => {
        res.redirect(`/api/widgets/listings/${listing.id}`);
      })
      .catch((e) => res.render("create_listing_page"));
  });

  router.get('/favourites', (req, res) => {
    const templateVars = {}
    templateVars.user = req.session.userId

    database.getFavouritesListings(req.session.userId)
      .then((data) => {
        templateVars.listings = data
        res.render("favourites_page", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  })

  return router;
};
