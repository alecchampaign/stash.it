import AddLink from './addLink.jsx';
import ArticleView from './articleView.jsx';
import Article from './article.jsx';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Modal from 'react-modal';
Modal.setAppElement('#mount');

const App = () => {
  const [link, setLink] = useState('');
  const [tags, setTags] = useState('');
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState({ title: null });
  const [filter, setFilter] = useState({ tag: null, changeVisible: null });
  const [visibleArticles, setVisibleArticles] = useState(articles);
  useEffect(() => {
    axios.get('/api/article').then(({ data }) => {
      setArticles(data);
      setVisibleArticles(data);
    });
  }, []);
  const filterBtn = filter.tag ? (
    <button
      id='filter-btn'
      onClick={() => {
        setFilter({ tag: null, changeVisible: null });
        setVisibleArticles(articles);
      }}
    >
      <i class='material-icons' style={{ verticalAlign: 'middle' }}>
        close
      </i>{' '}
      {filter.tag}
    </button>
  ) : (
    <span></span>
  );

  return (
    <Router>
      <Link to='/' className='react-link'>
        <h1 id='logo'>Stash.it</h1>
      </Link>
      <Switch>
        <Route exact path='/'>
          <div id='app'>
            <AddLink
              currentInput={link}
              setLink={setLink}
              setArticles={setArticles}
              articles={articles}
              tags={tags}
              setTags={setTags}
              setVisibleArticles={setVisibleArticles}
            />
            {filterBtn}
            <ArticleView
              articles={articles}
              setSelectedArticle={setSelectedArticle}
              setArticles={setArticles}
              setFilter={setFilter}
              setVisibleArticles={setVisibleArticles}
              visibleArticles={visibleArticles}
            />
          </div>
        </Route>
        <Route path='/article'>
          <Article article={selectedArticle} />
        </Route>
      </Switch>
    </Router>
  );
};

ReactDOM.render(<App />, document.querySelector('#mount'));
