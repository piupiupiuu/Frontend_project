import React, { useState } from 'react';
// import ReactDOM from 'react-dom';

import { LoginPage, LoginButton, LoginInput } from '../components/LoginPage.jsx'

export const Testinput = () => {
  const [color, setColor] = useState({ color: 'black' })
  return (
    <LoginPage sx={{ p: 2 }}>
      <LoginInput id='ipt' placeholder='E-mail*' name='email' style={color}/>
      <LoginButton variant='contained' size='large' onClick={() => { setColor({ color: 'red' }) }}>Login</LoginButton>
    </LoginPage>
  )
};
