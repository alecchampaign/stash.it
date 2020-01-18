# Stash.it - Find an article you like? Stash it for later!
## Overview
Stash.it is a tool for saving articles (and possibly other content in the future!) to read later. Provide a link, add some tags, and rest assured knowing that your content is accessible regardless of [outdated links](https://en.wikipedia.org/wiki/Link_rot), future paywalls, and other forms of future content restrictions. All while maintaining the convenience of internet-accessible data.

### Table of Contents
[Description](#Description)
[Installation](#Installation)
[Usage](#Usage) 
[Roadmap](#Roadmap)
[License](#License)

## Description
Stash.it allows users to archive articles for convenient access by simply submitting a URL. It does so by scraping the located resource for content found within `<article />` and `<title />` tags and saving said content in a persistent database. Additionally, Stash.it allow users to filter articles via added tags.

When adding tags the user is prompted with a list of ten suggested tags. The suggested tags are provided via [Google's Natural Language API](https://cloud.google.com/natural-language/), which processes the body of requested articles and determines related "entities". 

## Installation
Stash.it consists of an express server (which serves a React.js clientside) and a PostgreSQL database. Both the server and the database are containerized via Docker. An [official PostgreSQL image](https://hub.docker.com/_/postgres) is used for the database and a `dockerfile` is included to build the express server. You can of course pull the [image for the express server](https://hub.docker.com/repository/docker/alecchampaign/stashit) from Docker Hub as well.

### Database setup
For deployment, the following configuration is found within the `db.js` file. The configuration is setup in such a way to prepare for deployment on Heroku, and thus expects a database URL provided by the [PostgreSQL Database Add-on](https://elements.heroku.com/addons/heroku-postgresql).
```
const pool = new Pool({
  user: auth[0],
  password: auth[1],
  database: params.pathname.split('/')[1],
  host: params.hostname,
  port: params.port,
  ssl: true,
  max: 20,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 3000
});
module.exports = pool;
```
For local development, comment out the above and in the same file (`db.js`) uncomment the following:
```
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'stashit',
  host: 'db',
  port: process.env.DB_PORT,
  max: 20,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 3000
});
module.exports = pool;
```
The above configuration expects the `DB_USER`, `DB_PASS`, and `DB_PORT` environment variables, which are defined within the `docker-compose-template.yml` file. Also included in the `docker-compose-template.yml` file is a PostgreSQL container with the `POSTGRES_PASSWORD` and `POSTGRES_USER` environment variables.

Make a copy of the template and configure the `DB_USER` and `POSTGRES_USER` to match, as well as the `DB_PASS` and `POSTGRES_PASSWORD`. Set `DB_PORT` to `5432`, unless you want to change which port the PostgreSQL container runs on. 

### Starting the app
After setting up the database and database connection, run `docker-compose up` to start the app. By default, the express server is set to listen on port `4000`, but this may also be changed in the `docker-compose.yml` file.
## Usage
This tool is intended for personal use. The creator and contributors do not condone using Stash.it for the fraudulent hosting and distribution of content.

## Roadmap
- [ ] Implement user accounts
- [ ] Allow users to share articles
- [ ] Allow users to filter by multiple tags
- [ ] Improve article parsing to handle a wider range of article formats and sources
- [ ] Allow users to favorite articles (clickable star icon currently exists in each article card as a proof-of-concept)
- [ ] Parse article thumbnails
- [ ] Improve responsiveness
- [ ] Automatically categorize fetched articles via the use of Google's Natural Language API 
- [ ] Allow users to "like" articles

## License
Copyright (c) Alec Champaign

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
