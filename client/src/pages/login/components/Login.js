import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom'
const handleClick = () => {
    window.location = 'http://localhost:8000/oauth/facebook';
}

const LoginComponent = () => {
  return (
    <div className='LoginComponent'>
      <h1> Login </h1>
      <Button color="primary" onClick={handleClick}> primary</Button>
    </div>
  )
}

export default LoginComponent;
