import { React, useEffect, useState } from 'react'
import Nav from '../components/Nav.jsx'
import Page from '../components/Page.jsx'
import { token } from './login.jsx'
import styled from '@emotion/styled'
import MenuList from '@mui/material/MenuList';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import SpeedDial from '@mui/material/SpeedDial';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import EditQuestion from '../components/Editquestion.jsx'
import Question from '../components/QuestionButton.jsx'

export const EditGame = () => {
  const [questions, setQuestions] = useState([])
  const [game, setGame] = useState([])
  const location = useParams()
  let qId
  if (!location.questionId) {
    qId = '0'
  } else {
    if (location.questionId === 'newquestion') {
      qId = '-1'
    } else if (questions.length >= location.questionId && location.questionId > 0) {
      qId = location.questionId
    } else {
      qId = '0'
    }
  }
  const navigate = useNavigate()
  useEffect(() => {
    const url = 'http://localhost:5005/admin/quiz/' + location.gameId
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
            setQuestions(response.questions)
            setGame(response)
          })
        }
      })
  }, [navigate])

  const EditPage = styled.div`
    overflow:auto;
    height:100%;
    flex-grow:1;
    display:flex;
  `

  /* list of questions */
  const Questionlist = styled(MenuList)({
    backgroundColor: 'rgb(212, 203, 203)',
    minWidth: '190px',
    width: '190px',
    height: '100%',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      color: 'transparent',
      width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      backgroundColor: 'grey',
    }
  })

  function deleteQuestion (idx) {
    let questions = game.questions
    questions = questions.filter(function (value, index, questions) {
      return index !== idx;
    });
    const reqbody = { ...game, questions: questions }
    const url = 'http://localhost:5005/admin/quiz/' + location.gameId
    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify(reqbody)
    })
      .then(data => {
        if (data.status === 200) {
          handleDeleteQuestionClose() // close DeleteQuestion dialog
          data.json().then(response => {
            let nav;
            if (!location.questionId) {
              nav = '/edit/' + location.gameId + '/0'
            } else {
              nav = '/edit/' + location.gameId
            }
            navigate(nav)
          })
        }
      })
  }

  const [openDeleteQuestion, setDeleteQuestionOpen] = useState(false);
  const [openQuestionList, setOpenQuestionList] = useState(false);

  const handleDeleteQuestionOpen = () => {
    setDeleteQuestionOpen(true);
  };

  const handleDeleteQuestionClose = () => {
    setDeleteQuestionOpen(false);
  };

  const handleQuestionListOpen = () => {
    setOpenQuestionList(true);
  };

  const handleQuestionListClose = () => {
    setOpenQuestionList(false);
  };

  return (
    <Page>
      <Nav/>
      <EditPage>
        <Questionlist sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Question id='-1' qId={qId} onClick={navigate.bind(null, '/edit/' + location.gameId + '/newquestion')}/>
          <Question id='0' qId={qId} onClick={navigate.bind(null, '/edit/' + location.gameId)}/>
          <Divider variant='middle'/>
          {questions.map((question, index) => {
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <Question qId={qId} onClick={navigate.bind(null, '/edit/' + location.gameId + '/' + (index + 1))} id={'' + (index + 1)} />
                <Button
                  style={{ position: 'absolute', right: '10px' }}
                  sx={{ borderRadius: 0 }}
                  color="error"
                  startIcon={<DeleteForeverIcon/>}
                  onClick={handleDeleteQuestionOpen}
                ></Button>
                <Dialog
                  open={openDeleteQuestion}
                  onClose={handleDeleteQuestionClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {'Delete Question'}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to delete this question? This action cannot be undone.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleDeleteQuestionClose}>Cancel</Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={deleteQuestion.bind(null, index)}
                      autoFocus
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            )
          }
          )}
        </Questionlist>
        <Drawer
          variant="temporary"
          open={openQuestionList}
          onClick={handleQuestionListClose}
          onClose={handleQuestionListClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '190px' },
          }}
        >
          <Questionlist sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Question id='-1' qId={qId} onClick={navigate.bind(null, '/edit/' + location.gameId + '/newquestion')}/>
            <Question id='0' qId={qId} onClick={navigate.bind(null, '/edit/' + location.gameId)}/>
            <Divider variant='middle'/>
            {questions.map((question, index) => {
              return (
                <div key={index} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <Question qId={qId} onClick={navigate.bind(null, '/edit/' + location.gameId + '/' + (index + 1))} id={'' + (index + 1)} />
                  <Button
                    style={{ position: 'absolute', right: '10px' }}
                    sx={{ borderRadius: 0 }}
                    color="error"
                    startIcon={<DeleteForeverIcon/>}
                    onClick={handleDeleteQuestionOpen}
                  ></Button>
                  <Dialog
                    open={openDeleteQuestion}
                    onClose={handleDeleteQuestionClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {'Delete Question'}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this question? This action cannot be undone.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleDeleteQuestionClose}>Cancel</Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={deleteQuestion.bind(null, index)}
                        autoFocus
                      >
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              )
            }
            )}
          </Questionlist>
        </Drawer>
        <SpeedDial
          onClick={handleQuestionListOpen}
          ariaLabel="QuestionList Button"
          sx={{ position: 'absolute', top: 50, left: 16, display: { sm: 'none' } }}
          icon={<MenuIcon />}
        ></SpeedDial>
        <EditQuestion
          qid={parseInt(qId)}
          gameid={location.gameId}
          gameinfo={game}
          questions={questions[parseInt(qId) - 1]}
        />
      </EditPage>
    </Page>
  )
}
