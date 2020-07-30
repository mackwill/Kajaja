const database = require("./database");
const bcrypt = require("bcrypt");

// Returns the most recent message of a conversation thread
// per listing id
const filterMessagesByUser = function (messages) {
  const messagesByListing = [];
  const passedId = [];

  messages.forEach((message) => {
    if (!passedId.includes(message.listing_id)) {
      passedId.push(message.listing_id);
      messagesByListing.push(message);
    }
  });
  return messagesByListing;
};

exports.filterMessagesByUser = filterMessagesByUser;

// Returns amount of time since something was created
// or since the function was called)
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
    result = `a few seconds ago`;
  }
  return result;
};

exports.chrono = chrono;

// Adds a time since sent key to each message object
// by calling the chrono function
const timeSinceSent = (messages) => {
  const updatedMessages = [];
  messages.forEach((message) => {
    message.sent = chrono(new Date() - message.send_date);
    updatedMessages.push(message);
  });
  return updatedMessages;
};

exports.timeSinceSent = timeSinceSent;

//Check if user is logged in helper
const checkIfUserHasACookie = function (req, res, next) {
  return database
    .getUserWithId(req.session.userId)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((e) => {
      req.user = null;
      next();
    });
};
exports.checkIfUserHasACookie = checkIfUserHasACookie;

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

const filterByListingId = (listingId, array) => {
  return array.filter((listing) => {
    return listing.listing_id === Number(listingId);
  });
};

exports.filterByListingId = filterByListingId;

const generateRandomString = function (num) {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomStr = "";
  for (let i = num; i > 0; i--) {
    randomStr += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  return randomStr;
};
exports.generateRandomString = generateRandomString;
