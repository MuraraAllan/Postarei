import React from 'react';

const NewPost = (props) => {
  const dispatch = (e) => {
    e.preventDefault();
    props.dispatchBodyAction(e.target.value);
  };
  return (
    <input maxLength="900"
      onChange={dispatch}
      value={props.post.body} />
  );
};

export default NewPost;
