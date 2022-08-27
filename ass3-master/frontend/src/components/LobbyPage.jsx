import { React, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import GetAppIcon from '@mui/icons-material/GetApp';
// import Grid from '@mui/material/Grid';

export const LobbyScreen = ({ playerId, setStart, setMessage, setMessagetitle, setErrorshow }) => {
  const Lobby = styled.div`
    color: white;
    text-align: center;
    font-size: 20px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    width: 100%;
    height: 100px;
  `
  const dot = ['.', '..', '...', '....', '.....', '......']
  const [waitingTime, setWaitingTime] = useState(0)
  const [boring, setBoring] = useState(false)
  useEffect(() => {
    let t = 0
    const interval = window.setInterval(() => {
      t = t + 1
      setWaitingTime(t)
      const url = 'http://localhost:5005/play/' + playerId + '/status'
      fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(data => {
          if (data.status === 200) {
            data.json().then(response => {
              setStart(response.started)
            })
          } else {
            data.json().then(response => {
              setMessage(response.error)
              setMessagetitle('Error')
              setErrorshow(true)
            })
          }
        })
    }, 1000)
    return () => clearInterval(interval);
  }, [])
  return (
    <Lobby>
      <div><HourglassBottomIcon/> Waiting for the game to start{dot[waitingTime % 6]}</div>
      {waitingTime > 3 &&
      <div style={{ marginTop: '30px' }}>
        {boring
          ? <div>Nothing happened! I am a boring button! <EmojiEmotionsIcon/></div>
          : <div>Feel Boring?</div>
        }
        <Button variant='contained' startIcon={<GetAppIcon/>} sx={{ marginTop: '10px', backgroundColor: '#2597ef', boxShadow: '0px 7px 0px #3887c4', '&:hover': { boxShadow: '0 4px 0 #3887c4', backgroundColor: '#BCDFFA', color: '#3887c4' }, '&:active': { top: 2 } }} onClick={() => { setBoring(!boring) }}>Don&apos;t Click me!</Button>
      </div>
      }
    </Lobby>
  )
}
LobbyScreen.propTypes = {
  playerId: PropTypes.string,
  setStart: PropTypes.func,
  setMessage: PropTypes.func,
  setMessagetitle: PropTypes.func,
  setErrorshow: PropTypes.func
}
export default LobbyScreen;
