const express = require("express");
const router = express.Router();
const database = require("../database");
const helper = require("../helper");
module.exports = (db) => {
  router.get("/mymessages", (req, res) => {
    const user = req.session.userId;
    console.log("user: ", user);
    db.query(
      `SELECT * FROM message_thread
      JOIN listings ON listing_id = listings.id
      JOIN user_message ON thread_id = message_thread.id
      WHERE
        owner_id = $1
        OR sender_id = $1
      GROUP BY
        message_thread.id,
        listings.id,
        user_message.id
    ;`,
      [user]
    )
      .then((data) => {
        console.log("data here: ", helper.filterMessagesByUser(data.rows));
        res.render("all_messages", {
          messages: helper.filterMessagesByUser(data.rows),
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    const user = req.session.userId;
    const messageThread = req.params.id;
    console.log("thread id: ", messageThread);
    db.query(
      `SELECT * FROM user_message
      JOIN message_thread on thread_id = message_thread.id
      JOIN listings ON listing_id = listings.id
      WHERE
        thread_id = $1
      ORDER BY
        send_date
    ;`,
      [messageThread]
    )
      .then((data) => {
        console.log("messages per thread:", data.rows);
        res.render("single_message_page", {
          messages: data.rows,
          threadId: messageThread,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/:id", (req, res) => {
    const user = req.session.userId;
    const messageThread = req.params.id;
    console.log("here too ", messageThread);
    console.log("body: ", req.body);
    const message = Object.values(req.body);
    return db
      .query(
        `
      INSERT INTO user_message (thread_id, content)
      VALUES ($1, $2)
      RETURNING *
    ;`,
        [messageThread, message[0]]
      )
      .then((data) => {
        return data.rows;
      });
  });

  router.post("/", (req, res) => {
    const headerArr = req.headers.referer.split("/");
    const listingId = headerArr[headerArr.length - 1];
    const message = Object.values(req.body);
    console.log("listingID", listingId);
    console.log("message: ", message);
    const user = req.session.userId;
    console.log("user: ", user);
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
          res.render("index");
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
