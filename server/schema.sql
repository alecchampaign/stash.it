DROP TABLE tags;
DROP TABLE relevant_tags;
DROP TABLE articles;

CREATE TABLE articles
(
  id SERIAL PRIMARY KEY,
  title TEXT,
  body TEXT
);

CREATE TABLE tags
(
  id SERIAL PRIMARY KEY,
  name TEXT,
  article_id INT REFERENCES articles(id)
);

CREATE TABLE relevant_tags
(
  id SERIAL PRIMARY KEY,
  names TEXT
  [],
  article_id INT REFERENCES articles
  (id)
);