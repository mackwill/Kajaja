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
const methodOverride = require("method-override");

const fileUpload = require("express-fileupload");
const cors = require("cors");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

module.exports = db;

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(methodOverride("_method"));
app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 2 * 1024 * 1024 * 1024,
    },
  })
);
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    maxAge: 60 * 60 * 1000 * 1,
  })
);
app.set("view engine", "ejs");
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
app.use(express.static("uploads"));

// Separated Routes for each Resource
const messageRoutes = require("./routes/messages");
const nodemailerRoutes = require("./routes/mailer");
const uploadImagesRoutes = require("./routes/upload");

const listingsRoutes = require("./routes/listings");
const favouritesRoutes = require("./routes/favourites");
const usersRoutes = require("./routes/users");
const indexRoutes = require("./routes/index");

// Mount all resource routes
app.use("/api/messages", messageRoutes(db));
app.use("/api/mailer", nodemailerRoutes(db));
app.use("/api/upload", uploadImagesRoutes(db));

app.use("/api/listings", listingsRoutes(db));
app.use("/api/favourites", favouritesRoutes(db));
app.use("/api/users", usersRoutes(db));
app.use("/", indexRoutes(db));


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
