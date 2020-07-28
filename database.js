const db = require('./server')

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
  console.log(user)
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
  return db.query(`
    SELECT * FROM listings
    WHERE (setweight(to_tsvector(title), 'A') ||
    setweight(to_tsvector(category), 'B') ||
    setweight(to_tsvector(coalesce(description, '')), 'C'))
    @@ to_tsquery($1)
    ORDER BY ts_rank((setweight(to_tsvector(title), 'A') ||
    setweight(to_tsvector(category), 'B') ||
    setweight(to_tsvector(coalesce(description, '')), 'B')), to_tsquery($1)) DESC
  `, [data.q])
  .then(res => res.rows)
  .catch((e) => null)
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
