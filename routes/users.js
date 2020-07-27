/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt')
const database = require('../database')

module.exports = (db) => {
  //Get login form
  router.get("/login", (req, res) => {
    res.render("login_page");
  });

  //Get registration form
  router.get("/registration", (req, res) => {
    res.render("registration_page");
  });

  // Create a new user
  router.post('/', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);
    database.getUserWithEmail(user.email)
    .then(user => {
      if(user){
        res.send('Sorry user already exist')
      }else{
        database.addUser(user)
        .then(user => {
          if (!user) {
            res.send({error: "error"});
            return;
          }
          req.session.userId = user.id;
          res.send("🤗");
        })
        .catch(e => res.send(e));
      }
    });
    })


  //Login helper
  const login =  function(email, password) {
    return database.getUserWithEmail(email)
    .then(user => {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
      return null;
    });
  }
  exports.login = login;

  router.post('/login', (req, res) => {
    const {email, password} = req.body;
    login(email, password)
      .then(user => {
        if (!user) {
          res.send({error: "error"});
          return;
        }
        console.log('connected as:', user.name)
        req.session.userId = user.id;
        res.redirect('/')
      })
      .catch(e => res.send(e));
  });


  //Logout a user
  router.post('/logout', (req, res) => {
    req.session.userId = null;
    res.redirect('/');
  });

  return router;
};
