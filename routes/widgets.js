/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const database = require("../database");
const { chrono, checkIfUserHasACookie, hasListingBeenLiked } = require("../helper");
const TemplateVars = require('./schema/TemplateVars')


module.exports = (db) => {

  router.get("/listings/:id", checkIfUserHasACookie, (req, res) => {
    let templateVars = new TemplateVars(req.user)

    database
      .getSingleListing(req.params.id)
      .then((data) => {
        templateVars.single_listing = data
        templateVars.chrono_listing = chrono(new Date - data.creation_date.getTime())
        templateVars.chrono_owner = chrono(new Date - data.join_date.getTime())

        templateVars.data = data
        if(!req.session.history){
          req.session.history = []
        }
        req.session.history.unshift(Number(req.params.id))
        res.render("single_listing", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.delete('/listings/:id', (req, res) => {
    const activeUserId = req.session.userId
    database.deleteListingById(req.params.id)
    .then(() => {
      res.send({message:'Item successfully deleted'})
    })
    .catch((e) => {
      res.redirect(`/api/users/${activeUserId}`)
    })
  })

  router.get('/update/listings/:id', checkIfUserHasACookie, (req, res) => {
    let templateVars = new TemplateVars(req.user)

    database.getSingleListing(req.params.id)
    .then(listing => {
      templateVars.single_listing = listing
      res.render('update_listing', templateVars)
    })
    .catch(e => {
      templateVars.message = 'Sorry this listing is not yours, therefore you cannot update it'
      res.render('account_page', templateVars)
    })
  })

  router.post('/update/listings/:id', checkIfUserHasACookie, (req, res) => {
    let templateVars = new TemplateVars(req.user)

    database.updateSingleListing(req.params.id, req.body)
    .then(listing => {
      templateVars.single_listing = listing
      templateVars.message = "You have updated your account information successfully";
      res.render('update_listing', templateVars)
    })
    .catch((e) => {
      templateVars.message = 'Sorry we were not able to update the listing information'
      res.render('update_listing', templateVars)
    })
  })

  router.get("/listings", checkIfUserHasACookie, (req, res) => {
    let templateVars = new TemplateVars(req.user)
    !req.q ?
      templateVars.searchbar = {q:'', category:req.query.category, min:0, max:999} :
      templateVars.searchbar = req.query

    database
      .getListings(req.query)
      .then((data) => {
        templateVars.listings = data

        res.render("listings", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/create-listing", checkIfUserHasACookie, (req, res) => {
    if(!req.user){
      req.session.message = 'You need to be logged in to post an ad'
      res.redirect('/api/users/login')
    }else{
      let templateVars = new TemplateVars(req.user)
      res.render("create_listing_page", templateVars);
    }
  });

  router.post("/create-listing", (req, res) => {
    const listing = req.body;
    listing.owner_id = req.session.userId;

    database
      .createNewListing(listing)
      .then((listing) => {
        req.session.listingId = listing.id;
        res.redirect(`/api/widgets/update/listings/${listing.id}`);
      })
      .catch((e) => {
        let templateVars = new TemplateVars(undefined)
        res.render("create_listing_page", templateVars)
      });
  });

  router.get('/add-images/:id', checkIfUserHasACookie, (req, res) => {
    let templateVars = new TemplateVars(req.user)
    templateVars.fromUser = false

    if(req.params.id === 'abc'){
      templateVars.fromUser = true
      templateVars.single_listing = {}
      templateVars.single_listing.main_image = null

      res.render('add_images_page', templateVars)
    }else{
      database.getSingleListing(req.params.id)
      .then(listing => {
        templateVars.single_listing = listing
        res.render('add_images_page', templateVars)
      })
      .catch(e => {
        templateVars.single_listing.main_image = null
        res.render('add_images_page', templateVars)
      })
    }
  });

  ///////

  router.get('/favourites', checkIfUserHasACookie, (req, res) => {
    const templateVars = new TemplateVars(req.user)

    database
      .getFavouritesListings(req.session.userId)
      .then((data) => {
        templateVars.listings = data
        res.render("favourites_page", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/favourites/:id", (req, res) => {
    let errMessage = "Sorry the item couldnt be save to your favourites";
    if (!req.session.userId) {
      res.send({ message: "Sorry you need to be logged in" });
    } else {
      database
        .listingsLikedByUser(req.session.userId)
        .then((res) => {
          const favouritesArr = hasListingBeenLiked(req.params.id, res);
          if (favouritesArr.length > 0) {
            errMessage = "You already like this posting";
            throw Error;
          }
        })
        .then(() => {
          database.likeListing(req.session.userId, req.params.id);
        })

        .then((result) =>
          res.send({ message: "The item was added to your favourites" })
        )
        .catch((e) =>
          res.send({
            message: errMessage,
          })
        );
    }
  });

  return router;
};
