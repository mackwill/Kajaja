const express = require("express");
const router = express.Router();
const database = require("../database");
const helpers = require("../helper");
module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = {};
    const user = req.session.userId;
    console.log("user: ", user);
    db.query(
      `SELECT * FROM message_thread
      JOIN listings ON listing_id = listings.id
      JOIN user_message ON thread_id = message_thread.id
      WHERE
        owner_id = $1
        OR sender_id = $1
      ORDER BY send_date DESC;
    ;`,
      [user]
    )
      .then((data) => {
        console.log("data rows for /messages: ", data.rows);
        templateVars.messages = helpers.filterMessagesByUser(data.rows);

        if (req.session.userId) {
          database
            .getUserWithId(req.session.userId)
            .then((user) => {
              templateVars.user = user;
              res.render("all_messages", templateVars);
            })
            .catch((e) => {
              templateVars.user = null;
              res.render("all_messages", templateVars);
            });
        } else {
          templateVars.user = null;
          res.render("all_messages", templateVars);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    const templateVars = {};
    const user = req.session.userId;
    const messageThread = req.params.id;
    console.log("thread id: ", messageThread);
    db.query(
      `SELECT user_message.*, message_thread.*, listings.*, users.name FROM user_message
      JOIN message_thread on thread_id = message_thread.id
      JOIN listings ON listing_id = listings.id
      JOIN users ON sender_id = users.id
      WHERE
        thread_id = $1
      ORDER BY
        send_date
    ;`,
      [messageThread]
    )
      .then((data) => {
        templateVars.messages = helpers.timeSinceSent(data.rows);
        templateVars.threadId = messageThread;
        templateVars.title = data.rows[0].title;
        console.log(templateVars.messages);

        if (req.session.userId) {
          database
            .getUserWithId(req.session.userId)
            .then((user) => {
              templateVars.user = user;
              res.render("single_message_page", templateVars);
            })
            .catch((e) => {
              templateVars.user = null;
              res.render("single_message_page", templateVars);
            });
        } else {
          templateVars.user = null;
          res.render("single_message_page", templateVars);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/:id", (req, res) => {
    const templateVars = {};
    const user = req.session.userId;
    const messageThread = req.params.id;
    console.log("here too ", messageThread);
    console.log("body: ", req.body);
    const message = Object.values(req.body);
    return db
      .query(
        `
      INSERT INTO user_message (thread_id, sender_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    ;`,
        [messageThread, user, message[0]]
      )
      .then(() => {
        if (req.session.userId) {
          database
            .getUserWithId(req.session.userId)
            .then((user) => {
              templateVars.user = user;
              res.render("index", templateVars);
            })
            .catch((e) => {
              templateVars.user = null;
              res.render("index", templateVars);
            });
        } else {
          templateVars.user = null;
          res.render("index", templateVars);
        }
      });
  });

  router.post("/", (req, res) => {
    const templatVars = {};
    const headerArr = req.headers.referer.split("/");
    const listingId = headerArr[headerArr.length - 1];
    const message = Object.values(req.body);
    console.log("listingID", listingId);
    console.log("message: ", message);
    const user = req.session.userId;
    templatVars.user = user;
    db.query(
      `INSERT INTO message_thread (listing_id, sender_id)
      VALUES ($1, $2)

      RETURNING *
    ;`,
      [listingId, user]
    )
      .then((data) => {
        const threadId = data.rows[0].id;
        db.query(
          `
        INSERT INTO user_message (thread_id, content)
        VALUES ($1, $2)
        RETURNING *;
        `,
          [threadId, message[0]]
        ).then(() => {
          if (req.session.userId) {
            database
              .getUserWithId(req.session.userId)
              .then((user) => {
                templateVars.user = user;
                res.render("index", templateVars);
              })
              .catch((e) => {
                templateVars.user = null;
                res.render("index", templateVars);
              });
          } else {
            templateVars.user = null;
            res.render("index", templateVars);
          }
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
