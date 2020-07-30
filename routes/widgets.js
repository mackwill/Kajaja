/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const database = require("../database");
const { chrono } = require('../helper')


module.exports = (db) => {

  router.get("/listings/:id", (req, res) => {
    const templateVars = {}
    templateVars.searchbar = null

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

  router.delete('/listings/:id', (req, res) => {
    const activeUserId = req.session.userId
    database.deleteListingById(req.params.id)
    .then(listing => {
      res.send({message:'Item successfully deleted'})
    })
    .catch((e) => {
      res.redirect(`/api/users/${activeUserId}`)
    })
  })

  router.get('/update/listings/:id', (req, res) => {
    const templateVars = {}
    templateVars.searchbar = null
    templateVars.message = null

    database.getSingleListing(req.params.id)
    .then(listing => {
      templateVars.listing = listing
      templateVars.user = {}
      templateVars.user.id = listing.owner_id
      res.render('update_listing', templateVars)
    })
    .catch(e => {

    })
  })

  router.post('/update/listings/:id', (req, res) => {
    const templateVars = {}
    templateVars.searchbar = null
    templateVars.message = null


    database.updateSingleListing(req.params.id, req.body)
    .then(listing => {
      console.log('success:',listing)
      templateVars.user = {}
      templateVars.user.id = listing.owner_id
      templateVars.listing = listing
      templateVars.message = "You have updated your account information successfully";
      res.render('update_listing', templateVars)
    })
    .catch((e) => {
      templateVars.user = null
      templateVars.listing = null
      templateVars.message = 'Sorry we were not able to update the listing information'
      res.render('update_listing', templateVars)
    })
  })

  router.get("/listings", (req, res) => {
    const templateVars = {}
    if(!req.q){
      templateVars.searchbar = {q:'', category:req.query.category, min:0, max:999}

    }else{
      templateVars.searchbar = req.query
    }

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
    templateVars.searchbar = null

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

    database
      .createNewListing(listing)
      .then((listing) => {
        req.session.listingId = listing.id
        res.redirect(`/api/widgets/update/listings/${listing.id}`)
      })
      .catch((e) => res.render("create_listing_page"));
  });

  router.get('/add-images/:id', (req, res) => {
    const templateVars = {user: req.session.userId, listingId: req.params.id}
    templateVars.searchbar = null

    res.render('add_images_page', templateVars)
  })

  router.get('/favourites', (req, res) => {
    const templateVars = {}
    templateVars.searchbar = null

    database.getFavouritesListings(req.session.userId)
      .then((data) => {
        templateVars.user = {}
        templateVars.user.id = req.session.userId
        templateVars.listings = data
        res.render("favourites_page", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  })

  router.post('/favourites/:id', (req, res) => {
    if(!req.session.userId){
      res.send({message:'Sorry you need to be logged in'})
    }else{
    database.likeListing(req.session.userId, req.params.id)
    .then(result => res.send({message:'The item was added to your favourites'}))
    .catch((e) => res.send({message:'Sorry the item couldnt be save to your favourites'}))
    }
  })

  return router;
};
