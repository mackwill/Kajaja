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
