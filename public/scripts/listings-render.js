const createSingleListing = (listing) => {
  const singleListing = ` <a class="listing-link" href="#">
  <article class="listing-${listing.id}">
    <div class="listing-photo">
      <img src="https://via.placeholder.com/100x100" />
    </div>
    <div class="listing-content container-fluid">
      <div class="listing-header">
        <div class="listing-header-left">
          <h3>G${listing.title}</h3>
        </div>
        <div class="listing-header-right">
          <h3>$${listing.price}</h3>
        </div>
      </div>
      <div class="listing-content">
        ${listing.description}
      </div>
    </div>
  </article>
</a>`;

  return singleListing;
};

const renderListings = (listings) => {
  listings.forEach((listing) => {
    $("#all-listings").prepend(createSingleListing(listing));
  });
};

exports.renderListings = renderListings;
