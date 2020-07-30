const express = require("express");
const router = express.Router();
const database = require("../database");
const _ = require("lodash");
const { checkIfUserHasACookie } = require("../helper");
const TemplateVars = require('./schema/TemplateVars')


module.exports = (db) => {


  //Upload an avatar to the user's profile
  router.post("/avatar", async (req, res) => {
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: "No file uploaded",
        });
      } else {
        let avatar = req.files.avatar;

        avatar.mv("./public/uploads/" + avatar.name);
        const imageUrl = `/uploads/${avatar.name}`;
        database
          .addUserPicture(req.session.userId, imageUrl)
          .then(() => {
            res.redirect(`/api/users/${req.session.userId}`);
          })
          .catch((e) => {
            res.status(500).send(e);
          });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  //Upload the main image of a listing
  router.post("/main/:id", async (req, res) => {
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: "No file uploaded",
        });
      } else {
        let mainImage = req.files.mainImage;

        mainImage.mv("./public/uploads/" + mainImage.name);
        const imageUrl = `/uploads/${mainImage.name}`;
        database
          .addMainImageToListing(req.params.id, imageUrl)
          .then(() => {
            res.redirect(`/api/listings/${req.params.id}`);
          })
          .catch((e) => {
            res.redirect(`/api/listings/${req.params.id}`);
          });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  //Upload the side pictures of a listing
  router.post("/photos/:id", async (req, res) => {
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: "No file uploaded",
        });
      } else {
        let data = [];

        //loop all files
        _.forEach(_.keysIn(req.files.photos), (key) => {
          let photo = req.files.photos[key];

          //move photo to uploads directory
          photo.mv("./public/uploads/" + photo.name);

          //push file details
          data.push({
            name: photo.name,
            mimetype: photo.mimetype,
            size: photo.size,
          });
        });
        if (data.length > 0) {
          database
            .addImagesForListing(req.params.id, data)
            .then(() => {
              res.redirect(`/api/listings/${req.params.id}`);
            })
            .catch(() => {
              res.redirect(`/api/users/${req.session.userId}`);
            });
          //return response
        }
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  //Get the 'add image' form page
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
  })

return router;
};
