// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");
const methodOverride = require('method-override');


// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

module.exports = db;

const database = require('./database')


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(methodOverride('_method'));

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    maxAge: 60 * 60 * 1000 * 1,
  })
);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded",
  })
);
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const messageRoutes = require("./routes/messages");
const nodemailerRoutes = require("./routes/forgotPsw");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
app.use("/api/messages", messageRoutes(db));
app.use("/api/mailer", nodemailerRoutes(db));

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  const templateVars = {}
  if(req.session.userId){
    return database.getUserWithId(req.session.userId)
    .then(user => {
      templateVars.user = user

      if(req.session.history.length>=4){
        database.getRecentlyViewedListings(req.session.history)
        .then(recentlyViewed => {
          console.log('getting it:',recentlyViewed)
          templateVars.recentlyViewed = recentlyViewed
          console.log(templateVars)
          res.render("index", templateVars);
          return
        })
        .catch((e) => {
          res.render("index", templateVars);
          return
        })
      }else{
      console.log('history:',req.session.history)
      console.log('history length', req.session.history.length)
      console.log(templateVars)
      res.render("index", templateVars);
      }
    })
    .catch((e) => {
      templateVars.user = null
      res.render("index", templateVars);
    })
  }else{
  templateVars.user = null
  }
  res.render("index", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
