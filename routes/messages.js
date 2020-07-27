const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM user_message;`)
      .then((data) => {
        const msg = data.rows;
        console.log(msg);
        res.render("all_messages");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
