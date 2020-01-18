import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddTags = props => {
  const [activeTags, setActiveTags] = useState([]);
  const [relatedTags, setRelatedTags] = useState(props.relevantTags);
  // useEffect(() => {
  //   setRelatedTags(props.relevantTags);
  // });
  const postTags = tags => {
    axios
      .post('/api/article/tags', { tags, articleId: props.articleId })
      .then(() => {
        axios.get('/api/article', ({ data }) => props.setArticles(data));
      })
      .catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
  };
  return (
    <form>
      <div id='active-tags'>
        {activeTags?.map(tag => (
          <span
            className='tag tag-active'
            onClick={() => {
              const copyArr = activeTags.slice();
              copyArr.splice(activeTags.indexOf(tag), 1);
              setActiveTags(copyArr);
              setRelatedTags(relatedTags.concat([tag]));
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <div>
        <input
          class='tags-input'
          type='text'
          value={props.currentValue}
          onChange={e =>
            props.handleChange(e.target.value, setActiveTags, activeTags)
          }
        ></input>
        <button onClick={() => postTags(activeTags)}>Add Tags</button>
      </div>
      <div id='related-tags'>
        <h2>Suggested tags:</h2>
        {relatedTags.map(tag => {
          return (
            <span
              className='tag'
              onClick={() => {
                const copyArr = relatedTags.slice();
                copyArr.splice(relatedTags.indexOf(tag), 1);
                setRelatedTags(copyArr);
                setActiveTags(activeTags.concat([tag]));
              }}
            >
              {tag}
            </span>
          );
        })}
      </div>
    </form>
  );
};

export default AddTags;
