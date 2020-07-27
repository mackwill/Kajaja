SELECT
  *
FROM
  message_thread
  JOIN listings ON listing_id = listings.id
WHERE
  owner_id = 1
  OR sender_id = 1
GROUP BY
  message_thread.id,
  listings.id
