/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const database = require("../database");
const { chrono, login, checkIfUserHasACookie } = require("../helper");
const { Template } = require("ejs");
const TemplateVars = require('./schema/TemplateVars');


module.exports = (db) => {
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

  // Create a new user
  router.post("/", (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);
    database
      .getUserWithEmail(user.email)
      .then((existingUser) => {
        if (existingUser) {
          req.session.message = "Sorry User already exists";
          res.redirect("/api/users/registration");
        } else {
          database
            .addUser(user)
            .then((user) => {
              if (!user) {
                req.session.message = "Sorry there was an issue";
                res.redirect("/api/users/registration");
              } else {
                req.session.userId = user.id;
                res.redirect("/");
              }
            })
            .catch((e) => {
              req.session.message = "Sorry there was an issue";
              res.redirect("/api/users/registration");
            });
        }
      });
  });

  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const templateVars = new TemplateVars(undefined);
    login(email, password)
      .then((user) => {
        if (!user) {
          templateVars.message = "Sorry, those credentials do not match with our database";
          res.render('login_page', templateVars);
          return;
        }
        req.session.userId = user.id;
        res.redirect("/");
      })
      .catch(e => {
        templateVars.message = "Sorry, those credentials do not match with our database";
        res.render('login_page', templateVars);
      });
  });

  //Logout a user
  router.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/api/users/login");
  });

  router.get("/my-account", checkIfUserHasACookie, (req, res) => {
    const templateVars = new TemplateVars(req.user);
    res.render("account_page", templateVars);
  });

  router.post("/my-account", checkIfUserHasACookie, (req, res) => {
    const templateVars = new TemplateVars(req.user);
    const changes = req.body;

    if (bcrypt.compareSync(req.body.password, req.user.password)) {
      database
        .updateUserById(req.user, changes)
        .then((updatedUser) => {
          templateVars.user = updatedUser;
          templateVars.message = "You have updated your account information successfully";
          res.render("account_page", templateVars);
        })
        .catch((e) => {
          templateVars.message = "Sorry, there was an issue with your info updating";
          res.render("account_page", templateVars);
        });
    } else {
      templateVars.message = "Sorry, the password is not valid";
      res.render("account_page", templateVars);
    }
  });

  //Get a profile page for specific user
  router.get("/:id", checkIfUserHasACookie, (req, res) => {
    const templateVars = new TemplateVars(req.user);

    database
      .getPublicInfoUserById(req.params.id)
      .then((data) => {
        data.unix = chrono(new Date() - data[0].join_date.getTime());
        templateVars.listings = data;
        templateVars.activeProfilePage =
          req.params.id == req.session.userId ? true : false;
        res.render("profile_page", templateVars);
        return;
      })
      .catch((e) => {
        templateVars.activeProfilePage =
          req.params.id === req.session.userId ? true : false;
        res.render("profile_page", templateVars);
        return;
      });
  });

  return router;
};
