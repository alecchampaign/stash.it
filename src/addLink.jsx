import React from 'react';
import axios from 'axios';

const AddLink = props => {
  const getArticle = (url, tags) => {
    axios
      .post('/api/article', { url })
      .then(() => {
        axios
          .get('/api/article')
          .then(({ data }) => {
            props.setArticles(data);
            props.setTags(data.tags);
            props.setVisibleArticles(data);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.error(err));
  };
  return (
    <React.Fragment>
      <input
        type='text'
        onChange={e => props.setLink(e.target.value)}
        value={props.currentInput}
      ></input>
      <button
        id='add-link-btn'
        onClick={() => getArticle(props.currentInput, props.tags)}
      >
        Add Link
      </button>
    </React.Fragment>
  );
};

export default AddLink;
