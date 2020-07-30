const db = require('./server')
const bcrypt = require('bcrypt')


const getUserWithEmail = function(email) {
  return db.query(`
    SELECT * FROM users
    WHERE email = $1
`, [email])
.then(res => res.rows[0])
.catch((e) => null)
}
exports.getUserWithEmail = getUserWithEmail;

const getUserWithId = function(id) {
  return db.query(`
    SELECT * FROM users
    WHERE id = $1
  `, [id])
  .then(res => res.rows[0])
  .catch((e) => null)
}
exports.getUserWithId = getUserWithId;

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


const getListings = function(data){
  let value = null
  let finalQuery = null

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

  }else if(data.q){
    console.log('im here')
    const {q, min, max} = data
    let stringQuery = `
      SELECT * FROM listings
      WHERE (setweight(to_tsvector(title), 'A') ||
      setweight(to_tsvector(category), 'B') ||
      setweight(to_tsvector(coalesce(description, '')), 'C'))
      @@ to_tsquery($1)
    `
    if(data.category !== 'Categories...'){
      stringQuery += `AND category = '${data.category}'`
    }
    let endQuery = `
      AND sold = 'f'
      AND price BETWEEN $2 AND $3
      ORDER BY ts_rank((setweight(to_tsvector(title), 'A') ||
      setweight(to_tsvector(category), 'B') ||
      setweight(to_tsvector(coalesce(description, '')), 'B')), to_tsquery($1)) DESC
    `
    finalQuery = stringQuery.concat(endQuery)

    return db.query(finalQuery, [q, min, max])
    .then(res => res.rows)
    .catch((e) => null)
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


const getUserByResetToken = function(token){
  return db.query(`
    SELECT * FROM users
    WHERE token = $1
  `, [token])
  .then(res => res.rows[0])
  .catch((e) => null)
}
exports.getUserByResetToken = getUserByResetToken


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

const getRecentlyViewedListings = function(arrayOfId){
  let finalArr = [...new Set(arrayOfId)].splice(0,4)
  let queryStart = `
    SELECT * FROM listings
    WHERE (id IN(
  `
  if(finalArr.length === 1){
    queryStart += `$1))`
  }else if(finalArr.length ===2){
    queryStart += `$1, $2))`
  }else if(finalArr.length === 3){
    queryStart += `$1, $2, $3))`
  }else{
    queryStart += `$1, $2, $3, $4))`
  }
   return db.query(queryStart, finalArr)
  .then(res => res.rows)
  .catch((e) => null)
}
exports.getRecentlyViewedListings = getRecentlyViewedListings

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

const updateSingleListing = function(id, changes){
  const sold = changes.sold ? true : false
  const {title, description, price, category} = changes

  let initQuery = `
    UPDATE listings
    SET title = $1, description = $2, price = $3, sold = $4
  `
  if(category !== 'Categories...'){
    initQuery += `, category = $5 `
  }
  let finalQuery = initQuery.concat(`WHERE id = $6 OR category = $5 RETURNING *`)
  console.log(finalQuery)
  return db.query(finalQuery,[title, description, Number(price), sold, category, id])
  .then(res => res.rows[0])
  .catch((e) =>
  {
    console.log(e)
    null})
}
exports.updateSingleListing = updateSingleListing

const likeListing = function(userId, listingId){
  return db.query(`
    INSERT INTO user_favourites(user_id, listing_id)
    VALUES($1, $2)
  `, [userId, listingId])
  .then(res => res.rows[0])
  .catch((e) => null)
}
exports.likeListing = likeListing

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

const addImagesForListing = function(listingId, images){
  let middleQuery = null
  let value = []
  if(images.length === 1){
    middleQuery = `UPDATE listings SET picture_1 = $2 WHERE id = $1`
    value = [listingId, images[0].name]
  }else if(images.length === 2){
    middleQuery = `UPDATE listings SET picture_1 = $2, picture_2 = $3 WHERE id = $1`
    value = [listingId, images[0].name, images[1].name]
  }else if(images.length === 3){
    middleQuery = `UPDATE listings SET picture_1 = $2, picture_2 = $3, picture_3 = $4 WHERE id = $1`
    value = [listingId, images[0].name, images[1].name, images[2].name]
  }
  const finalQuery = middleQuery.concat(' RETURNING *')
  return db.query(finalQuery, value)
  .then(res => {
    console.log('success:',res.rows)
    res.rows
  })
  .catch((e) => {
    console.log('not working',e)
    null
    })
}
exports.addImagesForListing = addImagesForListing

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
