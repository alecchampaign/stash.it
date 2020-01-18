import React from 'react';

const Related = props => {
  return (
    <div id='related'>
      {props.relatedTags.map(tag => (
        <span className='tag'>{tag}</span>
      ))}
    </div>
  );
};

export default Related;
