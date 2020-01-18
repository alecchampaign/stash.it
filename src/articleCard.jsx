import React, { useState } from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import Modal from 'react-modal';
import AddTags from './addTags';
Modal.setAppElement('#mount');

const ArticleCard = props => {
  const [opened, setOpened] = useState(false);
  const [currentValue, setCurrentValue] = useState();
  const [starIsFilled, setStarIsFilled] = useState(false);
  const customStyles = {
    content: {
      top: '50%',
      left: '50em',
      right: '50em',
      bottom: 'auto',
      marginRight: '-25%',
      transform: 'translate(-50%, -50%)',
      boxShadow: '2px 2px 8px grey',
      border: 'none',
      padding: '3em',
      backgroundColor: '#f1dfd1',
      background: 'linear-gradient(315deg, #f1dfd1 0%, #f6f0ea 74%)'
    }
  };
  const handleChange = (value, setActiveTags, activeTags) => {
    if (value.includes(',')) {
      setActiveTags(activeTags.concat([value.slice(0, value.length - 1)]));
      setCurrentValue('');
    } else setCurrentValue(value);
  };
  const handleClick = tag => {
    const visibleArticles = props.articles.filter(article => {
      return article.tags.indexOf(tag) !== -1;
    });
    props.setVisibleArticles(visibleArticles);
    props.setFilter({ tag, changeVisible: props.setVisibleArticles });
  };

  const handleStarClick = () => {
    setStarIsFilled(!starIsFilled);
    star = !starIsFilled ? (
      <i
        className='star-icon material-icons'
        style={{ fontSize: '2em' }}
        onClick={handleStarClick}
      >
        star_border
      </i>
    ) : (
      <i
        className='star-icon material-icons'
        style={{ fontSize: '2em', color: 'orange' }}
        onClick={handleStarClick}
      >
        star
      </i>
    );
  };

  let star = !starIsFilled ? (
    <i
      className='star-icon material-icons'
      style={{ fontSize: '2em' }}
      onClick={handleStarClick}
    >
      star_border
    </i>
  ) : (
    <i
      className='star-icon material-icons'
      style={{ fontSize: '2em', color: 'orange' }}
      onClick={handleStarClick}
    >
      star
    </i>
  );
  return (
    <React.Fragment>
      <div className='article-card'>
        {star}
        <Link
          to='/article'
          className='react-link'
          onClick={() => props.setSelectedArticle(props.article)}
        >
          <h3>{props.article.title}</h3>
          <p>{props.article.body.substring(0, 150) + '...'}</p>
        </Link>
        <span className='tags'>
          {props.tags.map(tag => {
            return (
              <span className='tag' onClick={() => handleClick(tag)}>
                {tag}
              </span>
            );
          })}
        </span>
        <button className='add-tag-btn' onClick={() => setOpened(true)}>
          Add Tags
        </button>
        <Modal
          isOpen={opened}
          contentLabel='Add some tags'
          style={customStyles}
        >
          <button onClick={() => setOpened(false)}>Close</button>
          <AddTags
            currentValue={currentValue}
            handleChange={handleChange}
            relevantTags={props.article.relevantTags}
            setArticles={props.setArticles}
            articleId={props.article.id}
          />
        </Modal>
      </div>
      <Switch>
        <Route path='/article'></Route>
      </Switch>
    </React.Fragment>
  );
};

export default ArticleCard;
