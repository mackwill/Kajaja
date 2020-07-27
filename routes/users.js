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

    const templateVars = {user:null, message:null}
    if(req.session.message){
      templateVars.message = req.session.message
    }
    res.render("login_page", templateVars);
  });

  //Get registration form
  router.get("/registration", (req, res) => {
    // if(req.session.userId){
    //   res.redirect('/')
    // }
    const templateVars = {user:null}
    res.render("registration_page", templateVars);
  });

  // Create a new user
  router.post('/', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);
    console.log(user)
    database.getUserWithEmail(user.email)
    .then(existingUser => {
      if(existingUser){
        res.send('Sorry user already exist')
      }else{
        database.addUser(user)
        .then(user => {
          if (!user) {
            res.send({error: "error"});
            return;
          }
          req.session.userId = user.id;
          res.redirect('/')
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
        req.session.userId = user.id;
        res.redirect('/')
      })
      .catch(e => res.send(e));
  });


  //Logout a user
  router.get('/logout', (req, res) => {
    req.session.userId = null;
    res.redirect('/api/users/login');
  });

  const chrono = function(number) {
    let result = '';
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
  router.get('/:id', (req, res) => {
    const templateVars = {}
   database.getPublicInfoUserById(req.params.id)
    .then(data => {

      if(req.session.userId){
        database.getUserWithId(req.session.userId)
        .then(user => {
          templateVars.user = user
        })
        .catch((e) => templateVars.user = null)
      }

      data.unix = chrono(new Date - data[0].join_date.getTime())
      templateVars.data = data

      res.render("profile_page", templateVars)
    })
    .catch((e) => res.render("profile_page"))
  })

  return router;
};
