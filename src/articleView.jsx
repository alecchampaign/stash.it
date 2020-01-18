import React, { useState, useEffect } from 'react';
import ArticleCard from './articleCard.jsx';

const ArticleView = props => {
  if (props.visibleArticles?.length) {
    return (
      <div id='article-view'>
        {props.visibleArticles.map(article => {
          return (
            <ArticleCard
              setSelectedArticle={props.setSelectedArticle}
              setArticles={props.setArticles}
              article={article}
              tags={article.tags}
              setVisibleArticles={props.setVisibleArticles}
              articles={props.articles}
              setFilter={props.setFilter}
            />
          );
        })}
      </div>
    );
  } else return <div id='no-articles'>Add some articles</div>;
};

export default ArticleView;
