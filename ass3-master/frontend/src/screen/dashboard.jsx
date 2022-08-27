import { React, useEffect, useState } from 'react'
import { token } from './login.jsx'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import Nav from '../components/Nav.jsx'
import Page from '../components/Page.jsx'
import AddBoxIcon from '@mui/icons-material/AddBox';
import Modal from 'react-bootstrap/Modal';
import TextField from '@mui/material/TextField';
import CSVReader from 'react-csv-reader'
import Quizz from '../components/QuizzInfo.jsx'
import Errorpopup from '../components/Error.jsx'
import { useNavigate } from 'react-router-dom'

export const Dashboard = () => {
  const navigate = useNavigate()

  const DashboardPage = styled.div`
    flex-grow:1;
    padding: 10px 10px 20px;
    background-color: #f3f6f9;
    &>button {
      margin: 10px;
      font-size:20px;
      padding:8px 10px;
      border-radius:10px;
      :hover {
        cursor:pointer;
      }
    };
    &::-webkit-scrollbar {
      color:transparent;
      width:6px;
    };
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: grey;
    };
  `

  const Gamepage = styled.div`
    padding:0 5%;
    display:flex;
    justify-content:center;
    flex-wrap: wrap;
    gap: 5%;
  `
  /* when new game is created, reload the page */
  const [newModalShow, setNewModalShow] = useState(false);
  const [newgame, setNew] = useState(0)
  let newgamedata = []
  function NewgameModal (props) {
    function createNewgame () {
      console.log(newgamedata)
      const reqbody = {
        name: document.getElementById('newgame').value
      }
      fetch('http://localhost:5005/admin/quiz/new', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(reqbody)
      })
        .then(data => {
          if (data.status === 200) {
            setNew(newgame + 1)
            setNewModalShow(false)
            data.json().then(response => {
              const quizid = response.quizId
              /* if there's any csv file attached, update the game */
              if (newgamedata.length !== 0) {
                /* manipulate csv data */
                const questionInfo = []
                for (let i = 1; i < newgamedata[0].length; i++) {
                  const singleQuestion = {}
                  singleQuestion.questionid = i - 1
                  singleQuestion.question = newgamedata[2][i]
                  singleQuestion.timeLimit = newgamedata[3][i]
                  singleQuestion.attachmentType = newgamedata[4][i]
                  singleQuestion.attachmentImg = newgamedata[5][i]
                  singleQuestion.attachmentVideo = newgamedata[6][i]
                  singleQuestion.correctAnswer = newgamedata[9][i].split(',')
                  const answers = {
                    0: newgamedata[10][i],
                    1: newgamedata[11][i],
                    2: newgamedata[12][i],
                    3: newgamedata[13][i],
                    4: newgamedata[14][i],
                    5: newgamedata[15][i]
                  }
                  singleQuestion.answers = answers
                  if (newgamedata[7][i] === 'single') {
                    singleQuestion.questionType = false
                  } else {
                    singleQuestion.questionType = true
                  }
                  singleQuestion.point = newgamedata[8][i]
                  questionInfo.push(singleQuestion)
                }
                const newgameinfo = {
                  name: newgamedata[0][1],
                  thumbnail: newgamedata[1][1],
                  questions: questionInfo
                }
                console.log(newgameinfo)
                fetch('http://localhost:5005/admin/quiz/' + quizid, {
                  method: 'PUT',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: token
                  },
                  body: JSON.stringify(newgameinfo)
                })
                  .then(data => {
                    if (data.status === 200) {
                      data.json().then(response => {
                        setMessage('Your game is successfully created')
                        setTitle('Success')
                        setErrorShow(true)
                      })
                    } else {
                      data.json().then(response => {
                        setMessage(response.error)
                        setTitle('Error')
                        setErrorShow(true)
                      })
                    }
                  })
              } else {
                setMessage('Your game is successfully created')
                setTitle('Success')
                setErrorShow(true)
              }
            })
          } else {
            data.json.then(response => {
              setMessage(response.error)
              setTitle('Error')
              setErrorShow(true)
            })
          }
        })
    }

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create a new game
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: 'flex', gap: '30px' }}>
          <TextField
            required
            id="newgame"
            label="Game Name"
            defaultValue="My Game"
          />
          <div style={{ width: '45%' }}>
            <div>Upload a csv file:</div>
            <CSVReader id='csvreader' onFileLoaded={(data, fileInfo, originalFile) => { newgamedata = data }} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ margin: '5px' }} variant="outlined" onClick={props.onHide}>Cancel</Button>
          <Button id='create-confirm-btn' variant="outlined" onClick={createNewgame} autoFocus>Create</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  NewgameModal.propTypes = {
    onHide: PropTypes.func
  }

  const [games, setGames] = useState([])
  const [message, setMessage] = useState()
  const [title, setTitle] = useState()
  const [errorShow, setErrorShow] = useState(false)
  useEffect(() => {
    fetch('http://localhost:5005/admin/quiz', {
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
            response.quizzes.sort(function (a, b) {
              return b.createdAt < a.createdAt ? -1 : 1
            })
            setGames(response.quizzes)
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
  , [newgame])

  return (
    <Page style={{ backgroundColor: '#f3f6f9' }}>
      <Nav />
      <div style={{ width: '100%', textAlign: 'center', borderBottom: '1px solid #E0E0E0' }}>
        <Button id='create-btn' sx={{ width: '150px', margin: '10px', backgroundColor: '#2597ef', '&:hover': { backgroundColor: '#BCDFFA', color: '#3887c4', fontWeight: 'bold' }, '&:active': { top: 2 } }} variant="contained" startIcon={<AddBoxIcon />}
        onClick={() => setNewModalShow(true)}
        >
          Create
        </Button>
      </div>
      <DashboardPage style={{ overflow: 'auto' }}>
        <NewgameModal show={newModalShow} onHide={() => setNewModalShow(false)} />
        <Gamepage>
          {games.map((game) => {
            return (
              <Quizz key={game.id} id={game.id} games={games} setGames={setGames} setMessage={setMessage} setTitle={setTitle} setErrorShow={setErrorShow} navigate={navigate}/>
            )
          }
          )}
        </Gamepage>
      </DashboardPage>
      <Errorpopup show={errorShow} message={message} title={title} onHide={() => setErrorShow(false)}/>
    </Page>
  )
}
