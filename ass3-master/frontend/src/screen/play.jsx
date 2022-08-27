import { React, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Errorpopup from '../components/Error.jsx';
import Page from '../components/Page.jsx'
import Button from '@mui/material/Button'
import LogoutIcon from '@mui/icons-material/Logout';
import LobbyScreen from '../components/LobbyPage.jsx';
import GameScreen from '../components/GamePage.jsx';
import ResultScreen from '../components/PlayerResult.jsx';

export const PlayGame = () => {
  const location = useParams()
  const playerId = location.playerId
  const [start, setStart] = useState(false)
  const [result, setResult] = useState(false)
  const [message, setMessage] = useState()
  const [messageTitle, setMessagetitle] = useState()
  const [ErrorShow, setErrorshow] = useState(false)
  const questionInfo = useRef([])
  const navigate = useNavigate()
  const [cancel, setCancel] = useState(false)
  return (
    <Page style={{ background: 'linear-gradient(to top right, rgb(95,90,226),rgb(174,80,167))' }}>
      <Button variant="contained" startIcon={<LogoutIcon/>} onClick={() => { setCancel(true); setMessagetitle('Quit Game'); setMessage('Are you sure you want to quit?'); setErrorshow(true) }} sx={{ width: '100px', margin: '20px', backgroundColor: '#2597ef', '&:hover': { backgroundColor: '#BCDFFA', color: '#3887c4', fontWeight: 'bold' }, '&:active': { top: 2 } }} >Exit</Button>
      {start && !result &&
        <GameScreen playerId={playerId} setResult={setResult} setMessage={setMessage} setMessagetitle={setMessagetitle} setErrorshow={setErrorshow} questionInfo={questionInfo} navigate={navigate}/>
      }
      {start && result &&
        <ResultScreen playerId={playerId} setResult={setResult} setMessage={setMessage} setMessagetitle={setMessagetitle} setErrorshow={setErrorshow} questionInfo={questionInfo}/>
      }
      {!start &&
        <LobbyScreen playerId={playerId} setStart={setStart} setMessage={setMessage} setMessagetitle={setMessagetitle} setErrorshow={setErrorshow} />
      }
      <Errorpopup show={ErrorShow} message={message} title={messageTitle} onHide={() => setErrorshow(false)} quitgame={true} navigate={navigate} cancel={cancel}/>
    </Page>
  )
}
