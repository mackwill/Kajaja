// Checks to see if a category has been selected when the search is executed
// and adds the selection to the query string for the search
const checkCategories = (data) => {
  let stringQuery = `
  SELECT * FROM listings
  WHERE (setweight(to_tsvector(title), 'A') ||
  setweight(to_tsvector(category), 'B') ||
  setweight(to_tsvector(coalesce(description, '')), 'C'))
  @@ to_tsquery($1)
`;
  if (data.category !== "Categories...") {
    stringQuery += `AND category = '${data.category}'`;
  }
  let endQuery = `
  AND sold = 'f'
  AND price BETWEEN $2 AND $3
  ORDER BY ts_rank((setweight(to_tsvector(title), 'A') ||
  setweight(to_tsvector(category), 'B') ||
  setweight(to_tsvector(coalesce(description, '')), 'B')), to_tsquery($1)) DESC
`;
  return stringQuery.concat(endQuery);
};

exports.checkCategories = checkCategories;

// Checks how many listings have been viewed, up to a maximum of 4
const checkHowManyRecentlyViewed = (viewedArr) => {
  let queryStart = `
  SELECT * FROM listings
  WHERE (id IN(
`
  if (viewedArr.length === 1) {
    queryStart += `$1))`;
  } else if (viewedArr.length === 2) {
    queryStart += `$1, $2))`;
  } else if (viewedArr.length === 3) {
    queryStart += `$1, $2, $3))`;
  } else {
    queryStart += `$1, $2, $3, $4))`;
  }
  return queryStart;
};

exports.checkHowManyRecentlyViewed = checkHowManyRecentlyViewed;

const checkIfListingCategoryChaged = (category) => {
  let initQuery = `
  UPDATE listings
  SET title = $1, description = $2, price = $3, sold = $4
`;
  if (category !== "Categories...") {
    initQuery += `, category = $5 `;
  }
  return initQuery.concat(`WHERE id = $6 OR category = $5 RETURNING *`);
};

exports.checkIfListingCategoryChaged = checkIfListingCategoryChaged;

// Checks how many images the user has uploaded and provides the
// correct query string accordingly
const checkNumberOfImages = (images) => {
  let middleQuery = null;
  let value = [];
  if (images.length === 1) {
    middleQuery = `UPDATE listings SET picture_1 = $2 WHERE id = $1`;
    value = [listingId, images[0].name];
  } else if (images.length === 2) {
    middleQuery = `UPDATE listings SET picture_1 = $2, picture_2 = $3 WHERE id = $1`;
    value = [listingId, images[0].name, images[1].name];
  } else if (images.length === 3) {
    middleQuery = `UPDATE listings SET picture_1 = $2, picture_2 = $3, picture_3 = $4 WHERE id = $1`;
    value = [listingId, images[0].name, images[1].name, images[2].name];
  }
  return middleQuery.concat(" RETURNING *");
};

exports.checkNumberOfImages = checkNumberOfImages
