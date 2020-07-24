SELECT listings.* FROM user_favourites
JOIN listings ON listing_id = listings.id
JOIN users ON user_id = users.id
WHERE users.id = 1;

