DROP TABLE IF EXISTS user_message CASCADE;

DROP TABLE IF EXISTS message_thread CASCADE;

DROP TABLE IF EXISTS seller_reviews CASCADE;

DROP TABLE IF EXISTS listing_pictures CASCADE;

DROP TABLE IF EXISTS user_favourites CASCADE;

DROP TABLE IF EXISTS listing_boosts CASCADE;

DROP TABLE IF EXISTS listings CASCADE;

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users(
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  join_date TIMESTAMP DEFAULT now(),
  profile_pic_url VARCHAR(255) DEFAULT 'https://via.placeholder.com/100x100',
  phone_number VARCHAR(255)
);

CREATE TABLE listings(
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  description TEXT,
  isTrade BOOLEAN DEFAULT FALSE,
  price INTEGER,
  youtube_link VARCHAR(255),
  boosted BOOLEAN DEFAULT FALSE,
  creation_date TIMESTAMP DEFAULT now(),
  postal_code VARCHAR(255),
  sold BOOLEAN DEFAULT FALSE
);

CREATE TABLE listing_pictures(
  id SERIAL PRIMARY KEY NOT NULL,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  picture_1 VARCHAR(255) DEFAULT 'https://via.placeholder.com/100x100',
  picture_2 VARCHAR(255) DEFAULT 'https://via.placeholder.com/100x100',
  picture_3 VARCHAR(255) DEFAULT 'https://via.placeholder.com/100x100',
  picture_4 VARCHAR(255) DEFAULT 'https://via.placeholder.com/100x100'
);

CREATE TABLE user_favourites(
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE seller_reviews(
  id SERIAL PRIMARY KEY NOT NULL,
  buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  message TEXT
);

CREATE TABLE listing_boosts(
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  boost_type VARCHAR(255),
  boost_days INTEGER DEFAULT 1,
  price INTEGER DEFAULT 0
);

CREATE TABLE message_thread(
  id SERIAL PRIMARY KEY NOT NULL,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_message(
  id SERIAL PRIMARY KEY NOT NULL,
  thread_id INTEGER REFERENCES message_thread(id) ON DELETE CASCADE,
  content TEXT,
  send_date TIMESTAMP DEFAULT now()
);

ALTER TABLE
  user_message OWNER TO labber;

ALTER TABLE
  message_thread OWNER TO labber;

ALTER TABLE
  seller_reviews OWNER TO labber;

ALTER TABLE
  listing_pictures OWNER TO labber;

ALTER TABLE
  user_favourites OWNER TO labber;

ALTER TABLE
  listing_boosts OWNER TO labber;

ALTER TABLE
  listings OWNER TO labber;

ALTER TABLE
  users OWNER TO labber;
