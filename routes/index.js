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
  // Home page
  router.get("/", checkIfUserHasACookie, (req, res) => {
    const templateVars = new TemplateVars(req.user);

    if (!req.session.history) {
      res.render("index", templateVars);
    } else {
      database
        .getRecentlyViewedListings(req.session.history)
        .then((recentlyViewed) => {
          templateVars.recentlyViewed = recentlyViewed;
          res.render("index", templateVars);
        })
        .catch((e) => {
          res.render("index", templateVars);
        });
    }
  });

  //Get listings page
  router.get("/listings", checkIfUserHasACookie, (req, res) => {
    let templateVars = new TemplateVars(req.user);
    !req.q
      ? (templateVars.searchbar = {
        q: "",
        category: req.query.category,
        min: 0,
        max: 999,
      })
      : (templateVars.searchbar = req.query);

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

  //Get login form
  router.get("/login", checkIfUserHasACookie, (req, res) => {
    let templateVars = new TemplateVars(req.user);

    if (req.session.message) {
      templateVars.message = req.session.message;
      req.session.message = null;
    }
    res.render("login_page", templateVars);
  });

  //Get registration form
  router.get("/registration", checkIfUserHasACookie, (req, res) => {
    let templateVars = new TemplateVars(req.user);

    if (req.session.message) {
      templateVars.message = req.session.message;
      req.session.message = null;
    }
    res.render("registration_page", templateVars);
  });

  router.get("*", checkIfUserHasACookie, (req, res) => {
    let templateVars = new TemplateVars(req.user);
    res.render("404", templateVars);
  });
  return router;
};
