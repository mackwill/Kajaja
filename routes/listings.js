const express = require("express");
const router = express.Router();
const database = require("../database");
const {
  chrono,
  checkIfUserHasACookie,
  filterByListingId,
} = require("../helper");
const TemplateVars = require("./schema/TemplateVars");

module.exports = (db) => {
  router.get("/", checkIfUserHasACookie, (req, res) => {
    let templateVars = new TemplateVars(req.user);
    if (!req.query.q) {
      templateVars.searchbar = {
        q: "",
        category: req.query.category,
        min: 0,
        max: 999,
      };
    } else {
      templateVars.searchbar = req.query;
    }
    database
      .getListings(req.query)
      .then((data) => {
        templateVars.listings = data;

        res.render("listings", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Get the 'create a listing' form
  router.get("/create", checkIfUserHasACookie, (req, res) => {
    if (!req.user) {
      req.session.message = "You need to be logged in to post an ad";
      res.redirect("/login");
    } else {
      let templateVars = new TemplateVars(req.user);
      res.render("create_listing_page", templateVars);
    }
  });

  //Create a listing
  router.post("/create", (req, res) => {
    const listing = req.body;
    listing.owner_id = req.session.userId;

    database
      .createNewListing(listing)
      .then((listing) => {
        req.session.listingId = listing.id;
        res.redirect(`/api/listings/${listing.id}/update`);
      })
      .catch((e) => {
        let templateVars = new TemplateVars(undefined);
        res.render("create_listing_page", templateVars);
      });
  });

  //Get single listing page
  router.get("/:id", checkIfUserHasACookie, (req, res) => {
    let templateVars = new TemplateVars(req.user);

    database
      .getSingleListing(req.params.id)
      .then((data) => {
        templateVars.single_listing = data;
        templateVars.chrono_listing = chrono(
          new Date() - data.creation_date.getTime()
        );
        templateVars.chrono_owner = chrono(
          new Date() - data.join_date.getTime()
        );

        templateVars.data = data;
        if (!req.session.history) {
          req.session.history = [];
        }
        req.session.history.unshift(Number(req.params.id));
        res.render("single_listing", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Delete single listing page
  router.delete("/:id", (req, res) => {
    const activeUserId = req.session.userId;
    database
      .deleteListingById(req.params.id)
      .then(() => {
        res.send({ message: "Item successfully deleted" });
      })
      .catch((e) => {
        res.redirect(`/api/users/${activeUserId}`);
      });
  });

  //Get the 'update a listing' form
  router.get("/:id/update", checkIfUserHasACookie, (req, res) => {
    let templateVars = new TemplateVars(req.user);

    database
      .getSingleListing(req.params.id)
      .then((listing) => {
        templateVars.single_listing = listing;
        res.render("update_listing", templateVars);
      })
      .catch((e) => {
        templateVars.message =
          "Sorry this listing is not yours, therefore you cannot update it";
        res.render("account_page", templateVars);
      });
  });

  //Update a listing
  router.post("/:id/update", checkIfUserHasACookie, (req, res) => {
    let templateVars = new TemplateVars(req.user);

    database
      .updateSingleListing(req.params.id, req.body)
      .then((listing) => {
        templateVars.single_listing = listing;
        templateVars.message =
          "You have updated your account information successfully";
        res.render("update_listing", templateVars);
      })
      .catch((e) => {
        templateVars.message =
          "Sorry we were not able to update the listing information";
        res.render("update_listing", templateVars);
      });
  });

  return router;
};
