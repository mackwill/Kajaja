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
