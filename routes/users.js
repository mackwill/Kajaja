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
const helpers = require("../helper");

module.exports = (db) => {
  //Get login form
  router.get("/login", (req, res) => {
    const templateVars = { user: null, message: null };
    if (req.session.message) {
      templateVars.message = req.session.message;
      req.session.message = null;
    }
    res.render("login_page", templateVars);
  });

  //Get registration form
  router.get("/registration", (req, res) => {
    const templateVars = { user: null, message: null };
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
    console.log(user);
    database.getUserWithEmail(user.email).then((existingUser) => {
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
            }
            req.session.userId = user.id;
            res.redirect("/");
          })
          .catch((e) => {
            req.session.message = "Sorry there was an issue";
            res.redirect("/api/users/registration");
          });
      }
    });
  });

  //Login helper
  const login = function (email, password) {
    return database.getUserWithEmail(email).then((user) => {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
      return null;
    });
  };
  exports.login = login;

  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    login(email, password)
      .then((user) => {
        if (!user) {
          res.render('login_page', {user:null, message: "Sorry, those credentials do not match with our database"});
          return;
        }
        req.session.userId = user.id;
        res.redirect("/");
      })
      .catch(e => {
        res.render('login_page', {user:null, message:'Sorry, those credentials do not match with our database'})
      });
  });

  //Logout a user
  router.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/api/users/login");
  });

  router.get("/my-account", (req, res) => {
    const templateVars = { user: null, message: null };
    database
      .getUserWithId(req.session.userId)
      .then((user) => {
        templateVars.user = user;
        res.render("account_page", templateVars);
      })
      .catch((e) => {
        res.render("account_page", templateVars);
      });
  });

  router.post("/my-account", (req, res) => {
    const templateVars = { user: null, message: null };
    const changes = req.body;
    database
      .getUserWithId(req.session.userId)
      .then((user) => {
        templateVars.user = user;
        if (bcrypt.compareSync(req.body.password, user.password)) {
          database
            .updateUserById(user, changes)
            .then((updatedUser) => {
              templateVars.user = updatedUser;
              templateVars.message =
                "You have updated your account information successfully";
              res.render("account_page", templateVars);
            })
            .catch((e) => {
              templateVars.message =
                "Sorry, there was an issue with your info updating";
              res.render("account_page", templateVars);
            });
        } else {
          templateVars.message = "Sorry, the password is not valid";
          res.render("account_page", templateVars);
        }
      })
      .catch((e) => {
        res.redirect("/");
      });
  });

  const chrono = function (number) {
    let result = "";
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

  //Get a profile page for specific user
  router.get("/:id", (req, res) => {
    const templateVars = { user: null, activeProfilePage: false };

    database
      .getPublicInfoUserById(req.params.id)
      .then((data) => {
        data.unix = chrono(new Date() - data[0].join_date.getTime());
        templateVars.data = data;

        if (req.session.userId) {
          database
            .getUserWithId(req.session.userId)
            .then((user) => {
              if (user.id === req.session.userId) {
                templateVars.activeProfilePage = true;
              }
              templateVars.user = user;
              console.log(templateVars.user);
              res.render("profile_page", templateVars);
            })
            .catch((e) => {
              res.render("profile_page", templateVars);
            });
        }
        res.render("profile_page", templateVars);
      })
      .catch((e) => res.redirect("/"));
  });

  return router;
};
