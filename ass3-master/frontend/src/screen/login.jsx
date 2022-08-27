import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom';
import { LoginPage, LoginHeader, LoginButton, LoginPageContainer, Notice, LoginInput, Block } from '../components/LoginPage.jsx'
import Errorpopup from '../components/Error.jsx';

const Swap = styled.div`
  text-align: center;
  font-size: 16px;
  &>button {
    font-size: 16px;
    background: none;
    border: none;
    color: #BCDFFA;
    border-radius: 10px;
    margin: 0 6px;
    :hover {
      cursor: pointer;
      background-color: #BCDFFA;
      color: #3887c4
    }
  }
`

export const LoginScreen = () => {
  const [message, setMessage] = useState()
  const [title, setTitle] = useState()
  const navigate = useNavigate()
  const [errorVisible, setErrorVisible] = useState(false)
  return (
    <LoginPage sx={{ p: 2 }}>
      <LoginPageContainer id='login-page'>
        <LoginHeader >BigBrain</LoginHeader >
        <form id='login'>
          <Block className='email'>
            <LoginInput placeholder='E-mail*' name='email' onBlur={checkinput.bind(null, 'email')} onFocus={hideError.bind(null, 'email')}/>
            <Notice>Please enter your email.</Notice>
          </Block>
          <Block className='password'>
            <LoginInput type='password' placeholder='Password*' name='password' onBlur={checkinput.bind(null, 'password')} onFocus={hideError.bind(null, 'password')}/>
            <Notice>Please enter your password.</Notice>
          </Block>
          <Block>
            <LoginButton id='login-btn' variant='contained' size='large' onClick={login.bind(null, navigate, setErrorVisible, setMessage, setTitle)}>Login</LoginButton>
          </Block>
          <Swap>
            <span>Don&apos;t have an account?</span>
            <button id="join-now-btn" onClick={navigate.bind(null, '/register')}>Join now</button>
          </Swap>
        </form>
      </LoginPageContainer>
      <Errorpopup show={errorVisible} message={message} title={title} onHide={() => setErrorVisible(false)}/>
    </LoginPage>
  )
};

export const SignUpPage = () => {
  const [message, setMessage] = useState()
  const [title, setTitle] = useState()
  const navigate = useNavigate()
  const [errorVisible, setErrorVisible] = useState(false)
  return (
    <LoginPage sx={{ p: 2 }}>
      <LoginPageContainer id='sign-up-page'>
        <LoginHeader >BigBrain</LoginHeader >
        <form id='signup'>
          <Block className='email'>
            <LoginInput placeholder='E-mail*' name='email' onBlur={checkinput.bind(null, 'email')} onFocus={hideError.bind(null, 'email')}/>
            <Notice>Please enter your email.</Notice>
          </Block>
          <Block className='username'>
            <LoginInput placeholder='Name*' name='username' onBlur={checkinput.bind(null, 'username')} onFocus={hideError.bind(null, 'username')}/>
            <Notice>Please enter your name.</Notice>
          </Block>
          <Block className='password'>
            <LoginInput type='password' placeholder='Password*' name='password' onBlur={checkinput.bind(null, 'password')} onFocus={hideError.bind(null, 'password')}/>
            <Notice>Please enter your password.</Notice>
          </Block>
          <Block className='confirmpassword' >
            <LoginInput type='password' placeholder='Confirm password*' name='confirmpassword' onBlur={checkinput.bind(null, 'confirmpassword')} onFocus={hideError.bind(null, 'confirmpassword')}/>
            <Notice>Please enter your password again.</Notice>
          </Block>
          <Block>
            <LoginButton id='sign-up-btn' variant='contained' size='large' onClick={signup.bind(null, navigate, setErrorVisible, setMessage, setTitle)}>Sign up</LoginButton>
          </Block>
          <Swap>
            <span>Already have an account?</span>
            <button onClick={navigate.bind(null, '/login')}>Sign in</button>
          </Swap>
        </form>
      </LoginPageContainer>
      <Errorpopup show={errorVisible} message={message} title={title} onHide={() => setErrorVisible(false)}/>
    </LoginPage>
  )
};

function hideError (classname) {
  const form = document.getElementsByTagName('form')[0]
  const block = form.getElementsByClassName(classname)[0]
  const input = block.getElementsByTagName('input')[0]
  const notice = block.getElementsByTagName('div')[0]
  notice.style.display = 'none'
  input.style.cssText = 'border-bottom: white solid 1px'
}

function checkinput (classname) {
  const form = document.getElementsByTagName('form')[0]
  const block = form.getElementsByClassName(classname)[0]
  const input = block.getElementsByTagName('input')[0]
  const notice = block.getElementsByTagName('div')[0]
  if (input.value.length === 0) {
    if (classname === 'confirmpassword') {
      ReactDOM.render('Please enter your password again.', notice)
    }
    notice.style.display = 'block'
    input.style.cssText = 'border-bottom: red solid 1px'
    return false
  } else {
    return true
  }
}

function checkpassword () {
  const form = document.getElementsByTagName('form')[0]
  const confirmpasswordBlock = form.getElementsByClassName('confirmpassword')[0]
  const notice = confirmpasswordBlock.getElementsByTagName('div')[0]
  if (form.password.value !== form.confirmpassword.value) {
    ReactDOM.render('The password you entered does not match. Please try again.', notice)
    form.confirmpassword.style.cssText = 'border-bottom: red solid 1px'
    notice.style.display = 'block'
    return false
  } else {
    return true
  }
}

function signup (navigate, setErrorVisible, setMessage, setTitle) {
  const emailFilled = checkinput('email')
  const usernameFilled = checkinput('username')
  const passwordFilled = checkinput('password')
  const confirmpasswordFilled = checkinput('confirmpassword')
  const form = document.getElementsByTagName('form')[0]
  if (emailFilled === true && usernameFilled === true && passwordFilled === true && confirmpasswordFilled === true) {
    if (checkpassword() === true) {
      const reqBody = {
        email: form.email.value,
        password: form.password.value,
        name: form.username.value
      }
      Login(false, reqBody, navigate, setErrorVisible, setMessage, setTitle)
    }
  }
}

function login (navigate, setErrorVisible, setMessage, setTitle) {
  const emailFilled = checkinput('email')
  const passwordFilled = checkinput('password')
  const form = document.getElementsByTagName('form')[0]
  if (emailFilled === true && passwordFilled === true) {
    const reqBody = {
      email: form.email.value,
      password: form.password.value
    }
    Login(true, reqBody, navigate, setErrorVisible, setMessage, setTitle)
  }
}

/* store the token */
export let token = false

export function changeToken (newToken) {
  token = newToken
}

/* login = true, register = false */
function Login (login, reqBody, navigate, setErrorVisible, setMessage, setTitle) {
  let url
  if (login === true) {
    url = 'http://localhost:5005/admin/auth/login'
  } else {
    url = 'http://localhost:5005/admin/auth/register'
  }
  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqBody)
  })
    .then(data => {
      if (data.status === 200) {
        data.json().then(response => {
          token = response.token
          /* for url fragmentation */
          localStorage.setItem('token', token)
          /* switch to dashboard page */
          navigate('/dashboard')
        })
      } else {
        data.json().then(response => {
          setErrorVisible(true)
          setMessage(response.error)
          setTitle('Error')
        })
      }
    })
}
