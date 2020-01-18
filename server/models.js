const db = require('./db.js');
const key = require('./config');
const axios = require('axios');

const fetchRelevantTags = articleBody => {
  const post = {
    document: { type: 'PLAIN_TEXT', content: articleBody }
  };
  return axios
    .post(
      `https://language.googleapis.com/v1beta2/documents:analyzeEntities?key=${key}`,
      post
    )
    .then(data => {
      const relevantTags = data.data.entities.map(entity => entity.name);
      return relevantTags;
    })
    .catch(err => {
      console.error(err);
      throw new Error();
    });
};

module.exports.postArticle = (articleObj /*, tags*/) => {
  return fetchRelevantTags(articleObj.body).then(relevantTags => {
    return db
      .connect()
      .then(client => {
        return client
          .query('INSERT INTO articles (title, body) VALUES ($1, $2)', [
            articleObj.title,
            articleObj.body
          ])
          .then(() => {
            const queries = [];
            if (relevantTags.length) {
              queries.push(
                client
                  .query(
                    'INSERT INTO relevant_tags (names, article_id) VALUES ($1, (SELECT MAX(id) FROM articles))',
                    [relevantTags.slice(0, 10)]
                  )
                  .then(() => {
                    console.log('SUCCESS!');
                    client.release();
                  })
                  .catch(err => {
                    client.release();
                    console.error(err);
                    throw err;
                  })
              );
            }
            Promise.all(queries)
              .then(() => client.release())
              .catch(err => {
                console.error(err);
                throw new Error();
              });
          })
          .catch(err => {
            client.release();
            console.error(err);
            throw err;
          });
      })
      .catch(err => {
        console.error(err);
        throw err;
      });
  });
};

module.exports.postTags = (tags, articleId) => {
  const queries = [];
  let tagQuery = 'INSERT INTO tags (name, article_id) VALUES';
  for (let tag of tags) {
    if (tags.indexOf(tag) !== 0) tagQuery += ', ';
    tagQuery += ` ('${tag}', ${articleId})`;
  }
  console.log(tagQuery);
  return db.connect().then(client => {
    client
      .query(tagQuery)
      .then(() => client.release())
      .catch(err => {
        client.release();
        console.error(err);
        throw err;
      });
  });
};

const getTags = articleId => {
  return db.connect().then(client => {
    return client
      .query('SELECT name FROM tags WHERE tags.article_id = $1', [articleId])
      .then(data => {
        client.release();
        return data;
      })
      .catch(err => {
        client.release();
        throw new Error(err);
      });
  });
};

const getRelevantTags = articleId => {
  return db.connect().then(client => {
    return client
      .query('SELECT names FROM relevant_tags WHERE article_id = $1', [
        articleId
      ])
      .then(({ rows }) => {
        client.release();
        return rows;
      })
      .catch(err => {
        client.release();
        throw new Error(err);
      });
  });
};

module.exports.getArticles = () => {
  return db.connect().then(client => {
    return client
      .query('SELECT title, body, id FROM articles;')
      .then(({ rows }) => {
        client.release();
        const queries = [];
        const relevantQueries = [];
        rows.forEach(article => {
          queries.push(
            getTags(article.id).catch(err => {
              console.error(err);
              throw new Error();
            })
          );
          relevantQueries.push(
            getRelevantTags(article.id).catch(err => {
              console.error(err);
              throw new Error();
            })
          );
        });
        const articles = rows.map(row => ({
          title: row.title,
          body: row.body,
          id: row.id
        }));
        return Promise.all(queries)
          .then(data => {
            return Promise.all(relevantQueries)
              .then(relevantData => {
                for (let i = 0; i < data.length; i++) {
                  articles[i].tags = data[i].rows.map(row => row.name);
                  articles[i].relevantTags = relevantData[i][0].names;
                }
                return articles;
              })
              .catch(err => {
                console.error(err);
                throw new Error(err);
              });
          })
          .catch(err => {
            console.error(err);
            throw new Error(err);
          });
      });
  });
};
