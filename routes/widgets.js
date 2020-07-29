/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const database = require("../database");

const chrono = function(number) {
  let result = '';
  if (number / (60 * 60 * 24 * 356 * 1000) >= 1) {
    result = `${Math.floor(number / (60 * 60 * 24 * 365 * 1000))} years ago`;
  } else if (number / (60 * 60 * 24 * 30 * 1000) >= 1) {
    result = `${Math.floor(number / (60 * 60 * 24 * 30 * 1000))} months ago`;
  } else if (number / (60 * 60 * 24 * 30 * 1000) >= 1) {
    result = `${Math.floor(number / (60 * 60 * 24 * 1000))} days ago`;
  } else if (number / (60 * 60 * 1000) >= 1) {
    result = `${Math.floor(number / (60 * 60 * 1000))} hours ago`;
  } else if (number / (60 * 1000) >= 1) {
    result = `${Math.floor(number / (60 * 1000))} minutes ago`;
  } else {
    result = `few seconds ago`;
  }
  return result;
};

module.exports = (db) => {

  router.get("/listings/:id", (req, res) => {
    const templateVars = {}
    database.getSingleListing(req.params.id)
      .then((data) => {
        templateVars.listing = data
        templateVars.chrono_listing = chrono(new Date - data.creation_date.getTime())
        templateVars.chrono_owner = chrono(new Date - data.join_date.getTime())

        templateVars.data = data
        if(req.session.userId){
           database.getUserWithId(req.session.userId)
          .then(user => {
            if(!req.session.history){
              req.session.history = []
            }
            req.session.history.unshift(Number(req.params.id))
            templateVars.user = user
            res.render("single_listing", templateVars);
          })
          .catch((e) => {
            templateVars.user = null
            res.render("single_listing", templateVars);
          })
        }else{
        templateVars.user = null
        console.log(templateVars)
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
        req.session.listingId = listing.id
        res.redirect('/api/widgets/add-images')
      })
      .catch((e) => res.render("create_listing_page"));
  });

  router.get('/add-images', (req, res) => {
    const templateVars = {user: req.session.userId}
    res.render('add_images_page', templateVars)
  })

  router.post('/add-images', (req, res) => {
    console.log(req.body)
    //res.redirect(`/api/widgets/listings/${listing.id}`);
    res.send({good:'good'})
  })

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
