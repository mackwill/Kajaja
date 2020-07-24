DROP TABLE seller_reviews;
DROP TABLE user_favourites;
DROP TABLE listing_boosts;
DROP TABLE user_message;
DROP TABLE message_thread;
DROP TABLE listings;
DROP TABLE users;


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
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  description TEXT,
  isTrade BOOLEAN DEFAULT FALSE,
  price INTEGER,
  youtube_link VARCHAR(255),
  boosted BOOLEAN DEFAULT FALSE,
  creation_date DATE DEFAULT CURRENT_TIMESTAMP,
  postal_code VARCHAR(255)
);

CREATE TABLE listing_pictures(
  id SERIAL PRIMARY KEY NOT NULL,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  picture_1 VARCHAR(255) DEFAULT 'https://via.placeholder.com/100x100',
  picture_2 VARCHAR(255) DEFAULT 'https://via.placeholder.com/100x100',
  picture_3 VARCHAR(255) DEFAULT 'https://via.placeholder.com/100x100',
  picture_4 VARCHAR(255) DEFAULT 'https://via.placeholder.com/100x100',
)

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
  send_date DATE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users(name, email, password)
VALUES
('Vincent', 'vincent@gmail.com', 'password'),
('Will', 'will@gmail.com', 'password'),
('Ruth', 'ruth@gmail.com', 'password'),
('Joey', 'joey@gmail.com', 'password');

INSERT INTO listings(category, owner_id, description, isTrade, price, postal_code)
VALUES
('furniture', 1, 'Great sofa','f', 12000, 'h2j3w2'),
('car', 2, 'Great car','f', 1200000, 'h2j3w2'),
('furniture', 3, 'Greater sofa vs Greater bedframe','t',0, 'h2j3w2'),
('car', 4, 'Greater car','f', 1000000, 'h2j3w2');

INSERT INTO user_favourites(user_id, listing_id)
VALUES
(1, 3),
(1, 4),
(2, 3),
(2, 4);

INSERT INTO message_thread(listing_id, sender_id)
VALUES
(1,2),
(2,3),
(3,1),
(4,2);

INSERT INTO user_message(thread_id, content)
VALUES
(1, 'I would like to buy your great sofa, Vincent. I am Will.'),
(1, 'Hi Will, how much would you pay for my great sofa. I am Vincent.'),
(1, 'I would pay 80$. I am Will.'),
(2, 'I would like to buy your great car, Will. I am Ruth.'),
(2, 'Hi Ruth, how much would you pay for my great car. I am Will.'),
(2, 'I would pay 10K$. I am Ruth.');
