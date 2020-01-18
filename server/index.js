const express = require('express');
const app = express();
const parser = require('body-parser');
const path = require('path');
const cors = require('cors');
const cheerio = require('cheerio');
const jsonframe = require('jsonframe-cheerio');
const axios = require('axios');
const { postArticle, getArticles, postTags } = require('./models.js');

const PORT = process.env.PORT || 3000;

app.use(parser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../dist')));

app.post('/api/article', (req, res) => {
  axios
    .get(req.body.url)
    .then(({ data }) => {
      const $ = cheerio.load(data);
      jsonframe($); // initializes the plugin
      const frame = {
        title: 'h1',
        body: 'article'
      };
      const article = $('body').scrape(frame, { object: true });
      postArticle(article)
        .then(() => res.sendStatus(201))
        .catch(err => {
          console.error(err);
          res.sendStatus(500);
        });
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.post('/api/article/tags', (req, res) => {
  postTags(req.body.tags, req.body.articleId)
    .then(() => res.sendStatus(201))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.get('/api/article', (req, res) => {
  getArticles()
    .then(data => res.status(200).json(data))
    .catch(err => {
      console.error(err);
      res.sendStatus(404);
    });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
