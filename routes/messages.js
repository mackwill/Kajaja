const express = require("express");
const router = express.Router();
const database = require("../database");
const helpers = require("../helper");
const { checkIfUserHasACookie, filterByListingId } = require("../helper");
const TemplateVars = require("./schema/TemplateVars");

module.exports = (db) => {
  //Get a message thread
  router.get("/", checkIfUserHasACookie, (req, res) => {
    const templateVars = new TemplateVars(req.user);
    database
      .getMessagesFromUser(req.user.id)
      .then((data) => {
        templateVars.messages = helpers.timeSinceSent(
          helpers.filterMessagesByUser(data.rows)
        );
        res.render("all_messages", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Get a single message
  router.get("/:id", checkIfUserHasACookie, (req, res) => {
    const templateVars = new TemplateVars(req.user);
    database
      .getMessageThreadById(req.params.id)
      .then((data) => {
        templateVars.messages = helpers.timeSinceSent(data.rows);
        templateVars.threadId = req.params.id;
        templateVars.title = data.rows[0].title;

        res.render("single_message_page", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Post a single message to a thread
  router.post("/:id", checkIfUserHasACookie, (req, res) => {
    const userId = req.session.userId;
    const messageThreadId = req.params.id;

    const message = Object.values(req.body);
    database
      .createAMessage(messageThreadId, userId, message[0])
      .then(() => {
        res.end();
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Create a thread and add a message to it
  router.post("/", (req, res) => {
    const templatVars = new TemplateVars(undefined);
    const headerArr = req.headers.referer.split("/");
    const listingId = headerArr[headerArr.length - 1];
    const message = Object.values(req.body);
    const userId = req.session.userId;
    templatVars.user = userId;
    database
      .getMessagesFromUser(userId)
      .then((data) => {
        const messagesArr = filterByListingId(listingId, data.rows);
        if (messagesArr.length > 0) {
          database
            .insertIntoCreatedThread(
              messagesArr[0].thread_id,
              userId,
              message[0]
            )
            .then(() => {
              res.end();
            })
            .catch((err) => {
              res.status(500).json({ error: err.message });
            });
        } else {
          return data.rows;
        }
      })
      .then((data) => {
        // console.log("data: ", data);
        return database.createNewThread(listingId);
      })
      .then((data) => {
        console.log("data: ", data);
        const threadId = data[0].id;
        return database.insertIntoCreatedThread(threadId, userId, message[0]);
      })
      .then(() => {
        res.end();
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
