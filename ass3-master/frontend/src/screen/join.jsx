import React, { useState } from 'react'
import { LoginPage, LoginPageContainer, LoginHeader, LoginButton, Notice, Block, LoginInput } from '../components/LoginPage.jsx'
import { useParams, useNavigate } from 'react-router-dom';
import Errorpopup from '../components/Error';
// import Button from '@mui/material/Button';

export const JoinGame = () => {
  const location = useParams()
  const [sessionid, setSessionid] = useState(location.sessionid)
  const [playername, setPlayername] = useState()
  const [modalShow, setModalShow] = useState(false);
  const [messageTitle, setMessageTitle] = useState()
  const [message, setMessage] = useState()
  const navigate = useNavigate()

  /* validate input */
  function checkinput (inputid) {
    const inputarea = document.getElementById(inputid)
    const notice = inputarea.getElementsByClassName('notice')[0]
    const input = inputarea.getElementsByTagName('input')[0]
    if (input.value.length === 0) {
      notice.style.display = 'block'
      input.style.cssText = 'border-bottom: red solid 1px'
      return false
    } else {
      notice.style.display = 'none'
      input.style.cssText = 'border-bottom: white solid 1px'
    }
    return true
  }

  function join () {
    const idCheck = checkinput('sessionid')
    const nameCheck = checkinput('playername')
    if (idCheck && nameCheck) {
      const reqBody = {
        name: playername
      }
      const url = 'http://localhost:5005/play/join/' + sessionid
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
              const path = '/game/' + sessionid + '/play/' + response.playerId
              navigate(path)
            })
          } else {
            data.json().then(response => {
              setMessageTitle('Error')
              setMessage(response.error)
              setModalShow(true)
            })
          }
        })
    }
  }

  return (
    <LoginPage sx={{ p: 2 }}>
      <LoginPageContainer>
        <LoginHeader style={{ marginBottom: '30px' }}>Join a Session</LoginHeader >
        <form id='join'>
          <Block id='sessionid'>
            <LoginInput placeholder='Session Id*' defaultValue={sessionid} name='sessionid' onBlur={event => { checkinput('sessionid'); setSessionid(event.target.value) }}/>
            <Notice className='notice'>Please enter a Session Id.</Notice>
          </Block>
          <Block id='playername'>
            <LoginInput placeholder='Name*' name='playername' onBlur={event => { checkinput('playername'); setPlayername(event.target.value) }}/>
            <Notice className='notice'>Please provide a player name.</Notice>
          </Block>
          <Block>
            <LoginButton variant='contained' size='large' onClick={join}>Join</LoginButton>
          </Block>
        </form>
      </LoginPageContainer>
      <Errorpopup show={modalShow} message={message} title={messageTitle} onHide={() => setModalShow(false)}/>
    </LoginPage>
  )
}
