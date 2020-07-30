INSERT INTO
  users(name, email, password, phone_number)
VALUES
  (
    'Vincent',
    'vincent@gmail.com',
    '$2b$12$PWxZ0w7uC/t8c0Gg4nbgLueDudJKndzrN8rHanNTHAtr7iGw8AP72',
    '111-222-3333'
  ),
  (
    'Will',
    'will@gmail.com',
    '$2b$12$PWxZ0w7uC/t8c0Gg4nbgLueDudJKndzrN8rHanNTHAtr7iGw8AP72',
    '123-456-7890'
  ),
  (
    'Ruth',
    'ruth@gmail.com',
    '$2b$12$PWxZ0w7uC/t8c0Gg4nbgLueDudJKndzrN8rHanNTHAtr7iGw8AP72',
    '666-666-6666'
  ),
  (
    'Joey',
    'joey@gmail.com',
    '$2b$12$PWxZ0w7uC/t8c0Gg4nbgLueDudJKndzrN8rHanNTHAtr7iGw8AP72',
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
    sold,
    main_image
  )
VALUES
  (
    'Green Subaru',
    'cars',
    1,
    'Great green Subaru for sale, ideal for someone who like AWD cars. Only 100K km',
    'FALSE',
    3500,
    'FALSE',
    'FALSE',
    'H2G2Z8',
    'TRUE',
    'images/seed_01.png'
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
    'FALSE',
    'images/seed_02.png'
  ),
  (
    'Window Washing',
    'services',
    2,
    'Window washing in montreal outdoor and indoor',
    'FALSE',
    120,
    'FALSE',
    'FALSE',
    'H2V2N2',
    'FALSE',
    'images/seed_03.png'
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
    'FALSE',
    'images/seed_04.png'
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
    'FALSE',
    'images/seed_05.png'
  ),
  (
    'iPhone 7 128GB',
    'electronics',
    3,
    'Lightly used iPhone 7, 128GB for sale. Comes with case and charger',
    'FALSE',
    390,
    'FALSE',
    'TRUE',
    'H2V4A2',
    'FALSE',
    'images/seed_06.png'
  ),
  (
    'Fishing pole for fly fishing',
    'outdoor',
    3,
    'Nice fishing pole set with all the box and a bunch of baits and tackle. Free, pickup only',
    'FALSE',
    0,
    'FALSE',
    'FALSE',
    'H2V4A2',
    'FALSE',
    'images/seed_07.png'
  ),
  (
    '4 1/2 Rosemont near the metro',
    'apartments',
    3,
    'Looking to trade my 4 1/2 in Rosemont for a 5 1/2 in the mile end. I have a dog, so looking for pet friendly places.',
    'TRUE',
    0,
    'FALSE',
    'TRUE',
    'H2V4A2',
    'FALSE',
    'images/seed_08.png'
  ),
  (
    'Spend a day with the legened of Nicolas Cage',
    'services',
    2,
    'Nicolas Cage is bestowing upon us unworthy folks the opportunity, nay, the privillage of a lifetime, to spend an entire 7 minutes with the legend. We only say 7 minutes because the common human can only handle that level of greatness so 6 minutes, so we''re pushing the envelope a little here. Your majesty awaits.',
    'TRUE',
    999,
    'FALSE',
    'TRUE',
    'H2V4A2',
    'FALSE',
    'images/seed_09.png'
  );

;

INSERT INTO
  user_favourites(user_id, listing_id)
VALUES
  (1, 3),
  (1, 4),
  (2, 3),
  (2, 4);

INSERT INTO
  message_thread(listing_id)
VALUES
  (1),
  (2);

INSERT INTO
  user_message(thread_id, sender_id, content)
VALUES
  (
    1,
    2,
    'I would like to buy your green Peugeot bike, Vincent. I am Will.'
  ),
  (
    1,
    1,
    'Hi Will, how much would you pay for my bike. I am Vincent.'
  ),
  (1, 2, 'I would pay 280$. I am Will.'),
  (1, 1, 'Sold.'),
  (
    2,
    3,
    'I would like to buy your dinner table, Will. I am Ruth.'
  ),
  (
    2,
    2,
    'Hi Ruth, how much would you pay for my great car. I am Will.'
  ),
  (2, 3, 'I would pay 100$. I am Ruth.');
