const filterMessagesByUser = function (messages) {
  const messagesByListing = [];
  const passedId = [];

  messages.forEach((message) => {
    if (!passedId.includes(message.listing_id)) {
      passedId.push(message.listing_id);
      messagesByListing.push(message);
    }
  });
  console.log("messagesByListing", messagesByListing);
  return messagesByListing;
};

exports.filterMessagesByUser = filterMessagesByUser;

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

const timeSinceSent = (messages) => {
  const updatedMessages = [];
  messages.forEach((message) => {
    message.sent = chrono(new Date() - message.send_date);
    updatedMessages.push(message);
  });
  return updatedMessages;
};

exports.timeSinceSent = timeSinceSent;
