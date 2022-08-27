import { React, useEffect, useState } from 'react'
import { token } from '../screen/login.jsx'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import StopIcon from '@mui/icons-material/Stop';
import Modal from 'react-bootstrap/Modal';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Card from '@mui/material/Card';
import Pic from '../screen/default.png'
import PersonIcon from '@mui/icons-material/Person';
import Box from '@mui/material/Box';

export const Quizz = ({ id, games, setGames, setMessage, setTitle, setErrorShow, navigate }) => {
  /* created at: if less than 24 hours: display the time difference, otherwise date */
  function createdTime (time) {
    const current = new Date().getTime()
    const timeDiff = (current - Date.parse(time)) / 1000 / 60 / 60 / 24
    if (timeDiff > 1) {
      const dateTime = time.split('T')[0]
      const date = dateTime.split('-')
      return ('Post at: ' + date[2] + '/' + date[1] + '/' + date[0])
    } else {
      const hours = Math.floor((current - Date.parse(time)) / 1000 / 60 / 60)
      const minutes = Math.floor(((current - Date.parse(time)) / 1000 / 60 / 60 - hours) * 60)
      return (hours + ' hours ' + minutes + ' minutes ago')
    }
  }

  /* total time to complete */
  function Totaltime (questions) {
    let total = 0
    for (let i = 0; i < questions.length; i++) {
      total = total + parseInt(questions[i].timeLimit)
    }
    return total
  }

  /* check if the game is started */
  const [start, setStart] = useState(true)
  /* store quiz info */
  const [game, setGame] = useState({
    name: '',
    owner: '',
    questions: [],
    thumbnail: '',
    active: '',
    createdAt: '',
    oldSessions: []
  })
  /* default thumbnail */
  const [thumbnail, setThumbnail] = useState(Pic)

  const GameImg = styled.div`
  border-radius:10px;
  position: relative;
  height:50%;
  &>img {
    width:100%;
    height:100%;
  }
  &>div {
    position:absolute;
    bottom:10px;
    width:100%;
    padding:0 10px;
    display:flex;
    justify-content:space-between;
  }
  &>div>div {
    color:white;
    border-radius:4px;
    background-color:rgba(57,35,33,0.5);
    padding:5px 10px;
    font-size:14px;
  }
  `
  /* admin panel */
  const AdminPanel = styled.div`
  display:flex;
  justify-content: space-between;
  width:95%;
  position:absolute;
  bottom:30px;
  &>button{
    :hover {
      cursor: pointer
    }
  }

  &>div>button {
    margin: 0 5px;
    padding:5px 10px;
    :hover {
      cursor: pointer
    }
  }
  `

  const Gameinfo = styled.div`
    position:relative;
    padding: 5px 10px 10px;
    height:50%;
    & > h1 {
      font-size:30px;
      margin:0px 0 5px;
    }
    &>div {
      font-size:12px;
    }
    &>div>span {
      font-size:22px;
      font-weight:bold;
    }
  `

  const [deletedialogopen, setDeleteDialogOpen] = useState(false);

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  function deleteGame (id) {
    const url = 'http://localhost:5005/admin/quiz/' + id
    fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
      .then(data => {
        if (data.status === 200) {
          /* remove the game from game info */
          setGames(games.filter(item => item.id !== id))
        } else {
          data.json().then(response => {
            setMessage(response.error)
            setTitle('Error')
            setErrorShow(true)
          })
        }
      })
  }

  function startGame () {
    const url = 'http://localhost:5005/admin/quiz/' + id + '/start'
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
      .then(data => {
        if (data.status === 200) {
          setStart(false)
          const url = 'http://localhost:5005/admin/quiz/' + id
          fetch(url, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: token
            }
          })
            .then(data => {
              if (data.status === 200) {
                data.json().then(response => {
                  setSessionid(response.active)
                  setSessionShow(true)
                })
              }
            })
        } else {
          data.json().then(response => {
            setMessage(response.error)
            setTitle('Error')
            setErrorShow(true)
          })
        }
      })
  }

  function stopGame () {
    const url = 'http://localhost:5005/admin/quiz/' + id + '/end'
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
      .then(data => {
        if (data.status === 200) {
          setResultPopup(true)
          setStart(true)
        } else {
          data.json().then(response => {
            setMessage(response.error)
            setTitle('Error')
            setErrorShow(true)
          }
          )
        }
      })
  }

  /* popup with session url */
  const [sessionid, setSessionid] = useState()
  const [sessionShow, setSessionShow] = useState(false)
  function SessionModal (props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Session id
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Session Id: {props.sessionid}</span>
            <Button onClick={navigator.clipboard.writeText('http://localhost:3000/game/join/' + sessionid)}>Copy Link</Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
  SessionModal.propTypes = {
    onHide: PropTypes.func,
    sessionid: PropTypes.string
  }

  /* past sessions popup */
  const [historyShow, setHistoryShow] = useState(false)
  function PastHistory (props) {
    /* individual session */
    const Viewsession = styled.div`
      padding: 15px 10px;
      font-size: 16px;
      &:hover {
        cursor: pointer;
        color: blue;
        background-color: rgb(239,239,239);
        border-left: 4px #3887c4 solid;
      };
    `
    const SessionContainer = styled.div`
      overflow: auto;
      height: 300px;
      &::-webkit-scrollbar {
        color:transparent;
        width:6px;
      };
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: grey;
      };
    `
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Past Sessions
            <div style={{ fontSize: '12px', fontWeight: 'lighter' }}>*Click to view history sessions</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SessionContainer >
            {history.map(function (value, index) {
              return (
                <div key={index}>
                  <Viewsession className='view-session' onClick={() => { viewResult(value) }}>Session {value}</Viewsession>
                  <div style={{ width: '100%', backgroundColor: '#cfd8dc', height: '1px' }}></div>
                </div>
              )
            })
          }
          </SessionContainer>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
  PastHistory.propTypes = {
    onHide: PropTypes.func,
    sessions: PropTypes.array
  }
  /* get past sessions */
  const [history, setHistory] = useState([])
  function getHistory () {
    const url = 'http://localhost:5005/admin/quiz/' + id
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
      .then(data => {
        if (data.status === 200) {
          data.json().then(response => {
            setHistory(response.oldSessions)
            setHistoryShow(true)
          })
        } else {
          data.json().then(response => {
            setMessage(response.error)
            setTitle('Error')
            setErrorShow(true)
          })
        }
      })
  }

  /* next question */
  function advanceGame () {
    const url = 'http://localhost:5005/admin/quiz/' + id + '/advance'
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
      .then(data => {
        if (data.status === 200) {
          data.json().then(response => {
            console.log(response)
            if (response.stage === game.questions.length) {
              setResultPopup(true)
              setStart(true)
            }
          })
        } else {
          data.json().then(response => {
            setMessage(response.error)
            setTitle('Error')
            setErrorShow(true)
            setStart(true)
          }
          )
        }
      })
  }

  function viewResult (session) {
    setResultPopup(false)
    const path = '/game/' + session + '/gameResult'
    navigate(path)
  }

  const [resultPopup, setResultPopup] = useState(false)
  function ResultPopup (props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Game stopped
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Would you like to view the result?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => { viewResult(sessionid) }} autoFocus>Yes</Button>
          <Button id='view-result-no-btn' onClick={props.onHide}>No</Button>
        </Modal.Footer>
      </Modal>
    )
  }
  ResultPopup.propTypes = {
    onHide: PropTypes.func
  }

  useEffect(() => {
    const url = 'http://localhost:5005/admin/quiz/' + id
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
      .then(data => {
        if (data.status === 200) {
          data.json().then(response => {
            setGame(response)
            if (response.thumbnail !== null) {
              setThumbnail(response.thumbnail)
            }
            if (!response.active) {
              setStart(true)
            } else {
              setStart(false)
            }
          })
        } else {
          data.json().then(response => {
            setMessage(response.error)
            setTitle('Error')
            setErrorShow(true)
          })
        }
      })
  }, [])

  return (
    <Card
      id={id}
      elevation={8} // shade of card
      sx={{
        width: '500px',
        height: '400px',
        mt: 2,
        mb: 2,
        backgroundColor: 'rgba(212, 203, 203, 0.1)'
      }}
    >
      <GameImg>
        <img src={thumbnail} alt="Thumbnail Image"/>
        <div>
          <div>{Totaltime(game.questions)} seconds to complete</div>
          <div>{game.questions.length} Question(s)</div>
        </div>
      </GameImg>
      <Gameinfo>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{game.name}</h1>
        <div style={{ marginBottom: '5px', color: 'grey' }}>By <PersonIcon style={{ color: '#3887c4' }}/><b style={{ fontSize: '18px', color: '#3887c4' }}>{game.owner}</b></div>
        <div style={{ color: 'green' }}>{createdTime(game.createdAt)}</div>
        <div>
          <Button
            id='history-sessions-btn'
            variant="contained"
            startIcon={<MenuBookIcon />}
            onClick={ getHistory }
            sx={{ position: 'absolute', right: '20px', top: '10px', backgroundColor: '#2597ef', '&:hover': { backgroundColor: 'rgba(212, 203, 203, 0.1)', color: '#3887c4', fontWeight: 'bold' }, '&:active': { top: 12 } }}
          >
            History
          </Button>
        </div>
        <AdminPanel>
          {start &&
          <div style={{ display: 'flex' }}>
            <Button
              id='start-game-btn'
              sx={{ mr: 1, '&:hover': { backgroundColor: 'rgba(212, 203, 203, 0.3)', color: '#3887c4', fontWeight: 'bold' }, '&:active': { top: 2 } }}
              variant="contained"
              color="success"
              startIcon={<PlayArrowIcon />}
              onClick={startGame}
            >
              Start
            </Button>
          </div>
          }
          {!start &&
          <div style={{ display: 'flex' }}>
            <Button
              id='stop-game-btn'
              sx={{ mr: 1, '&:hover': { backgroundColor: 'rgba(212, 203, 203, 0.3)', color: '#3887c4', fontWeight: 'bold' }, '&:active': { top: 2 } }}
              variant="contained"
              color="warning"
              startIcon={<StopIcon />}
              onClick={stopGame}
            >
              Stop
            </Button>
            <Button variant='contained' onClick={advanceGame} sx={{ mr: 1, '&:hover': { backgroundColor: 'rgba(212, 203, 203, 0.3)', color: '#3887c4', fontWeight: 'bold' }, '&:active': { top: 2 } }}>Next question</Button>
          </div>
          }
          <Box sx={{ display: { xs: 'flex', sm: 'block' }, flexDirection: { xs: 'column' }, gap: { xs: '2px' } }}>
            <Button
              id='edit-game-btn'
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => { navigate(`/edit/${id}`) }}
              sx={{ mr: 1, '&:hover': { backgroundColor: 'rgba(212, 203, 203, 0.3)', color: '#3887c4', fontWeight: 'bold' }, '&:active': { top: 2 } }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteForeverIcon />}
              onClick={handleDeleteDialogOpen}
              sx={{ mr: 1, '&:hover': { backgroundColor: 'rgba(212, 203, 203, 0.3)', color: '#3887c4', fontWeight: 'bold' }, '&:active': { top: 2 } }}
            >
              Delete
            </Button>
            <Dialog
              open={deletedialogopen}
              onClose={handleDeleteDialogClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {'Delete Game'}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this game? This action cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                <Button color="error" onClick={() => { deleteGame(id) }} autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </AdminPanel>
      </Gameinfo>
      <ResultPopup show={resultPopup} onHide={() => setResultPopup(false)} />
      <SessionModal show={sessionShow} onHide={() => setSessionShow(false)} sessionid={sessionid}></SessionModal>
      <PastHistory show={historyShow} onHide={() => setHistoryShow(false)}></PastHistory>
    </Card>
  )
}

Quizz.propTypes = {
  id: PropTypes.number,
  games: PropTypes.array,
  setGames: PropTypes.func,
  setMessage: PropTypes.func,
  setTitle: PropTypes.func,
  setErrorShow: PropTypes.func,
  navigate: PropTypes.func,
}

export default Quizz;
