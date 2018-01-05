import React from 'react';
import { Button } from 'reactstrap';

const NewPost = (props) => {
  const dispatch = (e) => {
    e.preventDefault();
    props.dispatchBodyAction(e.target.value);
  };
  return (
    <textarea rows="5"
      cols="50"
      size="100"
      autofocus="true"
      spellcheck="true"
      onChange={dispatch}
      value={props.post.body} />
  );
};

export default NewPost;
