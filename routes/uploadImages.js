const express = require("express");
const router = express.Router();
const database = require("../database");
const _ = require("lodash");

module.exports = (db) => {


  router.post("/upload-avatar", async (req, res) => {
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

  router.post("/upload-main/:id", async (req, res) => {
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
            res.redirect(`/api/widgets/listings/${req.params.id}`);
          })
          .catch((e) => {
            res.redirect(`/api/widgets/listings/${req.params.id}`);
          });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  router.post("/upload-photos/:id", async (req, res) => {
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
              res.redirect(`/api/widgets/listings/${req.params.id}`);
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

return router;
};
