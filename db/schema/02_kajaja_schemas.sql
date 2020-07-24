DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS seller_review;
DROP TABLE IF EXISTS user_favourites;
DROP TABLE IF EXISTS listing_boost;
DROP TABLE IF EXISTS message;


CREATE TABLE users(
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  join_date DATE DEFAULT CURRENT_TIMESTAMP,
  profile_pic_url VARCHAR(255) DEFAULT 'https://via.placeholder.com/100x100',
  phone_number VARCHAR(255)
);

CREATE TABLE listings(
  id SERIAL PRIMARY KEY NOT NULL,
  category VARCHAR(255) NOT NULL,
  ad_type VARCHAR(255), NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  description TEXT,
  price_type VARCHAR(255),
  price INTEGER,
  youtube_link VARCHAR(255),
  boosted BOOLEAN DEFAULT FALSE
);

CREATE TABLE user_favourites(
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE
)

CREATE TABLE seller_reviews(
  id SERIAL PRIMARY KEY NOT NULL,
  buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE
  rating SMALLINT NOT NULL,
  message TEXT
)

CREATE TABLE listing_boosts(
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  boost_type VARCHAR(255),
  boost_days SMALLINT DEFAULT 1,
  price SMALLINT DEFAULT 0
)

CREATE TABLE message_thread(
  id SERIAL PRIMARY KEY NOT NULL,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
)

CREATE TABLE user_message(
  id SERIAL PRIMARY KEY NOT NULL,
  thread_id INTEGER REFERENCES message_thread(id) ON DELETE CASCADE,
  content TEXT,
  send_date DATE DEFAULT CURRENT_TIMESTAMP
)
