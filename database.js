const db = require('./server')
const bcrypt = require('bcrypt')
const queryHelpers = require('./queryHelpers')

// ------------------------------------ Users table queries ------------------------------------


// Return a user with a given email
const getUserWithEmail = function(email) {
  return db.query(`
    SELECT * FROM users
    WHERE email = $1
`, [email])
.then(res => res.rows[0])
.catch((e) => null)
}
exports.getUserWithEmail = getUserWithEmail;

// Return a user with a given id
const getUserWithId = function(id) {
  return db.query(`
    SELECT * FROM users
    WHERE id = $1
  `, [id])
  .then(res => res.rows[0])
  .catch((e) => null)
}
exports.getUserWithId = getUserWithId;

// Add a user to the database with all of the provided information
const addUser =  function(user) {
  const { name, email, password } = user
  return db.query(`
    INSERT INTO users (name, email, password)
    VALUES($1, $2, $3) RETURNING *
  `, [name, email, password])
  .then(res =>  res.rows[0])
  .catch((e) => null)
}
exports.addUser = addUser;

// Updates the database with a new password for the logged in user
const updateUserPasswordByUserId = function(userId, newPassword){
  return db.query(`
    UPDATE users
    SET password = $2
    WHERE id = $1 RETURNING *
  `, [userId, newPassword])
  .then(res => res.rows[0])
  .catch((e) => null)
}
exports.updateUserPasswordByUserId = updateUserPasswordByUserId

// Get 'public' information of a user by a given id
const getPublicInfoUserById = function(userId){
  return db.query(`
    SELECT users.name, users.email, users.join_date, users.profile_pic_url, users.phone_number, listings.*
    FROM users
    LEFT JOIN listings ON users.id = owner_id
    WHERE users.id = $1
  `, [userId])
  .then(res => res.rows)
  .catch((e) => null)
}
exports.getPublicInfoUserById = getPublicInfoUserById


// Checks for changes in any of the currently logged in user data
// and updates it in the databse
const updateUserById = function(user, changes){
  const {name, phone, email} = changes
  const {id} = user
  const initQuery = `
    UPDATE users
    SET name = $1, phone_number = $2, email = $3
  `
  if(changes.newpassword !== ''){
    initQuery += `, password = ${bcrypt.hashSync(changes.newpassword, 12)}`
  }

  endQuery = `
    WHERE id = $4
    RETURNING *
  `

  let finalQuery = initQuery.concat(endQuery)

  return db.query(finalQuery, [name, phone, email, id])
  .then(res => res.rows[0])
  .catch((e) => null)
}
exports.updateUserById = updateUserById

// Selects the reset token from the database for a given user
const getUserByResetToken = function(token){
  return db.query(`
    SELECT * FROM users
    WHERE token = $1
  `, [token])
  .then(res => res.rows[0])
  .catch((e) => null)
}
exports.getUserByResetToken = getUserByResetToken

// Updates the user's forget password token and sets
// it in the database
const updateUserTokenById = function(id, token){
  return db.query(`
    UPDATE users
    SET token = $1
    WHERE id = $2
    RETURNING *
  `,[token, id])
  .then(res => res.rows[0])
  .catch((e) => null)
}
exports.updateUserTokenById = updateUserTokenById

// Allows the user to update their profile picture and
// updates the database with the selected image
const addUserPicture = function(userId, imgUrl){
  return db.query(`
    UPDATE users
    SET profile_pic_url = $1
    WHERE id = $2
    RETURNING *
  `,[imgUrl, userId])
  .then(res => res.rows[0])
  .catch((e) => null)
}
exports.addUserPicture = addUserPicture

// ------------------------------------ Listing table queries ------------------------------------


// Create a new listing and insert into table
const createNewListing = function(listing){
  const {title, category, owner_id, description, isTrade, price, postal_code} = listing
  return db.query(`
    INSERT INTO listings (title, category, owner_id, description, isTrade, price, postal_code)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
  `,[title, category, owner_id, description, isTrade, Number(price), postal_code])
  .then(res => res.rows[0])
  .catch((e) => null)
}
exports.createNewListing = createNewListing

// Get all listings based on search parameters (i.e category, price etc.)
const getListings = function(data){
  let value = null
  let finalQuery = null

  // If no category is selected
  if(data.q === '' && data.category === 'Categories...'){
    const {min, max} = data
    finalQuery = `
      SELECT * FROM listings
      WHERE sold = 'f'
      AND price BETWEEN $1 AND $2
      ORDER BY creation_date DESC
    `
    return db.query(finalQuery, [min, max])
    .then(res => res.rows)
    .catch((e) => null)

    // If there is text in the search bar
  }else if(data.q){
    const {q, min, max} = data

    const finalQuery = queryHelpers.checkCategories(data)

    return db.query(finalQuery, [q, min, max])
    .then(res => res.rows)
    .catch((e) => null)

  // If a category is selected
  }else if(data.category){
    const {category, min, max} = data
    value = data.category
    finalQuery = `
      SELECT * FROM listings
      WHERE category = $1
      AND sold = 'f'
    `
    return db.query(finalQuery, [category])
    .then(res => res.rows)
    .catch((e) => null)
  }else{
    const {min, max} = data
    finalQuery = `
      SELECT * FROM listings
      WHERE sold = 'f'
      AND price BETWEEN $1 AND $2
    `
    return db.query(finalQuery, [min, max])
    .then(res => res.rows)
    .catch((e) => null)
  }
}
exports.getListings = getListings

// Get the listings favourited by the currently logged in user
const getFavouritesListings = function(userId){
  return db.query(`
    SELECT * FROM user_favourites
    JOIN users ON users.id = user_id
    JOIN listings ON listings.id = listing_id
    WHERE users.id = $1
  `, [userId])
  .then(res => res.rows)
  .catch((e) => null)
}
exports.getFavouritesListings = getFavouritesListings

// Once a user clicks on a listing link, this will return that
// single listing from the database
const getSingleListing = function(id){
  return db.query(`
    SELECT listings.*, users.join_date, users.name, users.phone_number, users.email
    FROM listings
    JOIN users ON users.id = owner_id
    WHERE listings.id = $1
  `, [id])
  .then(res => res.rows[0])
  .catch((e) => null)
}
exports.getSingleListing = getSingleListing

// Checks the listings viewed while logged in and returns
// those listings from the database
const getRecentlyViewedListings = function(arrayOfId){
  let finalArr = [...new Set(arrayOfId)].splice(0,4)

  const queryStart = queryHelpers.checkHowManyRecentlyViewed(finalArr)

  return db.query(queryStart, finalArr)
  .then(res => res.rows)
  .catch((e) => null)
}
exports.getRecentlyViewedListings = getRecentlyViewedListings

// Delete user with a given id from the database
const deleteListingById = function(listingId){
  return db.query(`
    DELETE FROM listings
    WHERE id = $1
    RETURNING *
  `,[listingId])
  .then(res => res.rows[0])
  .catch((e) => null)
}
exports.deleteListingById = deleteListingById

// Updates a selected listing with the changed data
const updateSingleListing = function(id, changes){
  const sold = changes.sold ? true : false
  const {title, description, price, category} = changes

  const finalQuery = queryHelpers.checkIfListingCategoryChaged(category)

  return db.query(finalQuery,[title, description, Number(price), sold, category, id])
  .then(res => res.rows[0])
  .catch((e) =>
  {
    console.log(e)
    null})
}

exports.updateSingleListing = updateSingleListing

// Allows the user to "like" a listing and updates the database with
// the user id and listing id
const likeListing = function(userId, listingId){
  return db.query(`
    INSERT INTO user_favourites(user_id, listing_id)
    VALUES($1, $2)
  `, [userId, listingId])
  .then(res => res.rows[0])
  .catch((e) => null)
}
exports.likeListing = likeListing

// Returns a list of listings already liked by the user
const listingsLikedByUser = function(userId){
  return db.query(`
    SELECT * FROM user_favourites
    WHERE user_id = $1
  `, [userId])
  .then(res => {
    return res.rows
  })
  .catch((e) => null)
}
exports.listingsLikedByUser = listingsLikedByUser


// Allows the user to add up to 4 images to their listing
// which are then stored in the database
const addImagesForListing = function(listingId, images){

  // const finalQuery = checkNumberOfImages(images)

  let middleQuery = null
  let value = []
  if(images.length === 1){
    middleQuery = `UPDATE listings SET picture_1 = $2 WHERE id = $1`
    value = [listingId, `/uploads/${images[0].name}`]
  }else if(images.length === 2){
    middleQuery = `UPDATE listings SET picture_1 = $2, picture_2 = $3 WHERE id = $1`
    value = [listingId, `/uploads/${images[0].name}`, `/uploads/${images[1].name}`]
  }else if(images.length === 3){
    middleQuery = `UPDATE listings SET picture_1 = $2, picture_2 = $3, picture_3 = $4 WHERE id = $1`
    value = [listingId, `/uploads/${images[0].name}`, `/uploads/${images[1].name}`, `/uploads/${images[3].name}`]
  }
  const finalQuery = middleQuery.concat(' RETURNING *')
  return db.query(finalQuery, value)
  .then(res => {
    res.rows
  })
  .catch((e) => {
    null
    })
}
exports.addImagesForListing = addImagesForListing

// Allows the user to add a main image to their listing
// and stores in the database
const addMainImageToListing = function(listingId, image){
  return db.query(`
    UPDATE listings
    SET main_image = $2
    WHERE id = $1
  `, [listingId, image])
  .then(res => res.rows[0])
  .catch((e) => null)
}
exports.addMainImageToListing = addMainImageToListing

// ------------------------------------ Messages table queries ------------------------------------


const getMessagesFromUser = function(userId){
  return db.query(`
    SELECT * FROM message_thread
    JOIN listings ON listing_id = listings.id
    JOIN user_message ON thread_id = message_thread.id
    WHERE owner_id = $1 OR sender_id = $1
    ORDER BY send_date DESC;
  `,[userId])
  .then(res => res)
  .catch((e) => null)
}
exports.getMessagesFromUser = getMessagesFromUser

const getMessageThreadById = function(threadId){
return db.query(`
  SELECT user_message.*, message_thread.*, listings.*, users.name FROM user_message
  JOIN message_thread on thread_id = message_thread.id
  JOIN listings ON listing_id = listings.id
  JOIN users ON sender_id = users.id
  WHERE thread_id = $1
  ORDER BY send_date;
  `, [threadId])
  .then(res => res)
  .catch((e) => null)
}
exports.getMessageThreadById = getMessageThreadById

const createAMessage = function(thread_id, user_id, message){
  return db.query(`
    INSERT INTO user_message (thread_id, sender_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [thread_id, user_id, message])
}
exports.createAMessage = createAMessage

const createNewThread = function(listingId){
  return db.query(`
  INSERT INTO message_thread (listing_id)
  VALUES ($1)
  RETURNING *;
  `, [listingId])
  .then(res => res.rows)
  .catch((e) => null)
}
exports.createNewThread = createNewThread

const insertIntoCreatedThread = function(threadId, userId, message){
  return db.query(`
    INSERT INTO user_message (thread_id, sender_id, content)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [threadId, userId, message])
}
exports.insertIntoCreatedThread = insertIntoCreatedThread
