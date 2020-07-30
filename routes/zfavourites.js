const express = require("express");
const router = express.Router();
const database = require("../database");
const { checkIfUserHasACookie, hasListingBeenLiked } = require("../helper");
const TemplateVars = require('./schema/TemplateVars')


module.exports = (db) => {

  //Get the user's favourite listings
  router.get('/', checkIfUserHasACookie, (req, res) => {
    const templateVars = new TemplateVars(req.user)

    database.getFavouritesListings(req.session.userId)
      .then((data) => {
        templateVars.listings = data
        res.render("favourites_page", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  })

  //Add a listing to a user's favourite listing
  router.post("/:id", (req, res) => {
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
