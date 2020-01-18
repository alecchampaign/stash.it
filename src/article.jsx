import React from 'react';

const Article = props => {
  console.log(props.article);
  return (
    <div className='article'>
      <div class='heading'>
        <h1 className='article-title'>{props.article.title}</h1>
        {props.article.tags.map(tag => {
          return <span class='tag'>{tag}</span>;
        })}
      </div>
      <p className='article-body'>
        &nbsp;&nbsp;&nbsp;&nbsp;{props.article.body}
      </p>
    </div>
  );
};

export default Article;
