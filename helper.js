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

// const createMessage = (message) => {
//   return `
//   <a class="message-link" href="/api/messages/<%=message.thread_id%>">
//     <article class="message">
//       <div class="listing-photo">
//         <img src="https://via.placeholder.com/100x100" />
//       </div>
//       <div class="message-content container-fluid">
//         <div class="message-header">
//           <div class="message-header-left">
//             <h3><%= message.title %></h3>
//           </div>
//           <div class="message-header-right">
//             <h3>$<%= message.price %></h3>
//           </div>
//         </div>
//         <div class="message-content">
//           <%= message.content %>
//         </div>
//       </div>
//     </article>
//   </a>
// `;
// };

// const renderMessages = (messages) => {
//   messages.forEach((message) => {
//     $("#all-messages").preped(createMessage(message));
//   });
// };

// exports.renderMessages = renderMessages;
