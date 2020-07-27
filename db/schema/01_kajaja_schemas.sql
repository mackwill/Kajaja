DROP TABLE IF EXISTS user_message CASCADE;

DROP TABLE IF EXISTS message_thread CASCADE;

DROP TABLE IF EXISTS seller_reviews CASCADE;

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

INSERT INTO
  users(name, email, password, phone_number)
VALUES
  (
    'Vincent',
    'vincent@gmail.com',
    'password',
    '111-222-3333'
  ),
  (
    'Will',
    'will@gmail.com',
    'password',
    '123-456-7890'
  ),
  (
    'Ruth',
    'ruth@gmail.com',
    'password',
    '666-666-6666'
  ),
  (
    'Joey',
    'joey@gmail.com',
    'password',
    '345-534-6542'
  );

INSERT INTO
  listings(
    title,
    category,
    owner_id,
    description,
    isTrade,
    price,
    youtube_link,
    boosted,
    postal_code,
    sold
  )
VALUES
  (
    'Green Peugeot',
    'bicycles',
    1,
    'Great green Peugeot bicylcle for sale, ideal for someone 5''10 to 6''2',
    'FALSE',
    350,
    'FALSE',
    'FALSE',
    'H2G2Z8',
    'TRUE'
  ),
  (
    'Dinner Table',
    'furniture',
    2,
    'Nice sturdy black dinner table for sale',
    'FALSE',
    200,
    'FALSE',
    'TRUE',
    'H2V2N2',
    'FALSE'
  ),
  (
    'Queen size mattress',
    'furniture',
    2,
    'Queen size mattress in great condition',
    'FALSE',
    30,
    'FALSE',
    'FALSE',
    'H2V2N2',
    'FALSE'
  ),
  (
    'Harry Potter book collection',
    'books',
    4,
    'Complete collection of Harry Potter books for sale. Pick up only',
    'FALSE',
    50,
    'FALSE',
    'TRUE',
    'H2E2B1',
    'FALSE'
  ),
  (
    'Like new computer desk',
    'furniture',
    1,
    'Like new computer desk that comes with chair. In great condition',
    'FALSE',
    110,
    'FALSE',
    'FALSE',
    'H2X3R4',
    'FALSE'
  ),
  (
    'iPhone 7 128GB',
    'Electronics',
    3,
    'Lightly used iPhone 7, 128GB for sale. Comes with case and charger',
    'FALSE',
    390,
    'FALSE',
    'TRUE',
    'H2V4A2',
    'FALSE'
  ),
  (
    'Fish vase for sale',
    'Arts & Crafts',
    3,
    'Vase shaped like a fish, perfect for use as a water pitcher. Free, pickup only',
    'FALSE',
    0,
    'FALSE',
    'FALSE',
    'H2V4A2',
    'FALSE'
  ),
  (
    'Opus bike for trade',
    'bicycles',
    3,
    'Looking to trade my red Opus city bike for a similar condition road bike',
    'TRUE',
    0,
    'FALSE',
    'TRUE',
    'H2V4A2',
    'FALSE'
  );

INSERT INTO
  user_favourites(user_id, listing_id)
VALUES
  (1, 3),
  (1, 4),
  (2, 3),
  (2, 4);

INSERT INTO
  message_thread(listing_id, sender_id)
VALUES
  (1, 2),
  (2, 3),
  (3, 1),
  (4, 2);

INSERT INTO
  user_message(thread_id, content)
VALUES
  (
    1,
    'I would like to buy your green Peugeot bike, Vincent. I am Will.'
  ),
  (
    1,
    'Hi Will, how much would you pay for my bike. I am Vincent.'
  ),
  (1, 'I would pay 280$. I am Will.'),
  (1, 'Sold.'),
  (
    2,
    'I would like to buy your dinner table, Will. I am Ruth.'
  ),
  (
    2,
    'Hi Ruth, how much would you pay for my great car. I am Will.'
  ),
  (2, 'I would pay 100$. I am Ruth.');
