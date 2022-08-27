import { React, useState, useRef } from 'react'
import { token } from '../screen/login.jsx'
import { Notice } from '../components/LoginPage.jsx'
import styled from '@emotion/styled'
import MenuItem from '@mui/material/MenuItem';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import Errorpopup from './Error.jsx';

export const EditQuestion = ({ qid, gameinfo, questions, gameid }) => {
  const Edit = styled.form`
  flex-grow: 1;
  overflow:auto;
  text-align:center;
  &::-webkit-scrollbar {
    color:transparent;
    width:6px;
  };
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: grey;
  };
  `
  /* game: edit game; !game: edit question
     add: add button; !add: update button */
  let game, add
  let initialAttachmentType = 'none'
  let initialAttachmentImg = null
  let initialAttachmentVideo = null
  let initialQuestion = ''
  let initialQuestiontype = true
  let initialTimelimit = 0
  let initialPoint = 0
  let initialCorrectAnswer = []
  let initialAnswer = {
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
    5: ''
  }
  if (qid === 0) {
    game = true
    add = false
  } else if (qid === -1) {
    game = false
    add = true
    initialAttachmentType = 'none'
    initialAttachmentImg = null
    initialAttachmentVideo = null
    initialQuestion = ''
    initialQuestiontype = true
    initialTimelimit = 0
    initialPoint = 0
    initialCorrectAnswer = []
    initialAnswer = {
      0: '',
      1: '',
      2: '',
      3: '',
      4: '',
      5: ''
    }
  } else {
    game = false
    add = false
    initialAttachmentType = questions.attachmentType
    initialAttachmentImg = questions.attachmentImg
    initialAttachmentVideo = questions.attachmentVideo
    initialQuestion = questions.question
    initialQuestiontype = questions.questionType
    initialTimelimit = questions.timeLimit
    initialPoint = questions.point
    initialCorrectAnswer = questions.correctAnswer
    initialAnswer = questions.answers
  }

  const [attachmentType, setAttachmentType] = useState(initialAttachmentType)
  const [attachmentImg, setAttachmentImg] = useState(initialAttachmentImg)
  const [attachmentVideo, setAttachmentVideo] = useState(initialAttachmentVideo)
  const correctAnswer = useRef(initialCorrectAnswer)
  const [choice, setChoice] = useState(initialQuestiontype)
  const gamename = useRef(gameinfo.name)
  const [gameimg, setGameimg] = useState(gameinfo.thumbnail)
  const question = useRef(initialQuestion)
  const timelimit = useRef(initialTimelimit)
  const point = useRef(initialPoint)
  const answer = useRef(initialAnswer)

  const handleCorrectAnswer = (event) => {
    if (choice === false) {
      correctAnswer.current = [event.target.value]
      console.log(correctAnswer.current)
    } else {
      console.log(event.target.value)
      correctAnswer.current = event.target.value
      console.log(correctAnswer.current)
    }
  };

  const handleChoice = (event) => {
    if (event.target.value === 'true') {
      setChoice(true)
    } else {
      setChoice(false)
      correctAnswer.current = [correctAnswer.current[0]]
    }
  };
  const reader = new FileReader();
  const handleGamename = (event) => {
    gamename.current = event.target.value
  }

  const handleGameimg = (event) => {
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      setGameimg(reader.result)
    }
  }

  const handleQuestionimg = (event) => {
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      setAttachmentImg(reader.result)
    }
  }

  const handleQuestionvideo = (event) => {
    if (event.target.checkValidity() && event.target.value !== '') {
      const urlId = event.target.value.split('/')
      const url = 'https://youtube.com/embed/' + urlId[urlId.length - 1]
      setAttachmentVideo(url)
    } else {
      setAttachmentVideo(null)
    }
  }

  const handleQuestion = (event) => {
    question.current = event.target.value
  }

  const handleTimelimit = (event) => {
    timelimit.current = event.target.value
  }

  const handlePoint = (event) => {
    point.current = event.target.value
  }

  /* validate input */
  function checkGamename () {
    if (gamename.current.length > 0) {
      return true
    }
    const gameName = document.getElementsByClassName('gamename')[0]
    const input = gameName.getElementsByTagName('input')[0]
    const notice = gameName.getElementsByClassName('notice')[0]
    notice.style.display = 'block'
    input.style.cssText = 'border: red solid 1px'
    return false
  }

  function checkQuestion () {
    if (question.current.length > 0) {
      return true
    }
    const questionText = document.getElementsByClassName('question')[0]
    const notice = questionText.getElementsByClassName('notice')[0]
    notice.style.display = 'block'
    return false
  }

  function checkAnswer () {
    let count = 0
    for (let i = 0; i < 6; i++) {
      if (answer.current[i].length > 0) {
        count = count + 1
      }
    }
    if (count >= 2) {
      return true
    }
    const answerText = document.getElementsByClassName('answer')[0]
    const notice = answerText.getElementsByClassName('notice')[0]
    notice.style.display = 'block'
    return false
  }

  function checkTimelimit () {
    if (timelimit.current > 0) {
      return true
    }
    const time = document.getElementsByClassName('timelimit')[0]
    const notice = time.getElementsByClassName('notice')[0]
    notice.style.display = 'block'
    return false
  }

  function checkPoint () {
    if (point.current < 0) {
      const pointText = document.getElementsByClassName('point')[0]
      const notice = pointText.getElementsByClassName('notice')[0]
      notice.style.display = 'block'
      return false
    }
    return true
  }
  function checkAttachment () {
    if (attachmentType === 'none' || (attachmentType === 'video' && attachmentVideo !== null) || (attachmentType === 'img' && attachmentImg !== null)) {
      return true
    }
    const Attachment = document.getElementsByClassName('attachment')[0]
    const input = Attachment.getElementsByTagName('input')[0]
    const notice = Attachment.getElementsByClassName('notice')[0]
    notice.style.display = 'block'
    input.style.cssText = 'border: red solid 1px'
    return false
  }
  function checkCorrectAnswer () {
    const correct = document.getElementsByClassName('correctanswer')[0]
    const notice = correct.getElementsByClassName('notice')[0]
    if (correctAnswer.current.length === 0) {
      notice.style.display = 'block'
      ReactDOM.render('Please provide the correct answer.', notice)
      return false
    } else {
      for (let i = 0; i < correctAnswer.current.length; i++) {
        if (answer.current[correctAnswer.current[i]] === '') {
          notice.style.display = 'block'
          ReactDOM.render('The correct answer does not match with the answers provided.', notice)
          return false
        }
      }
    }
    return true
  }

  /* submit update */
  function submitQuestion () {
    const ansCheck = checkAnswer()
    const qCheck = checkQuestion()
    const tCheck = checkTimelimit()
    const pCheck = checkPoint()
    const cCheck = checkCorrectAnswer()
    const attCheck = checkAttachment()
    if (ansCheck && qCheck && tCheck && pCheck && cCheck && attCheck) {
      const questions = gameinfo.questions
      let questionId
      if (qid === -1) {
        questionId = questions.length
      } else {
        questionId = qid - 1
      }
      const questionbody = {
        questionid: questionId,
        timeLimit: timelimit.current,
        attachmentType: attachmentType,
        attachmentImg: attachmentImg,
        attachmentVideo: attachmentVideo,
        question: question.current,
        questionType: choice,
        point: point.current,
        correctAnswer: correctAnswer.current,
        answers: answer.current
      }
      if (qid === -1) {
        questions[questions.length] = questionbody
      } else {
        questions[qid - 1] = questionbody
      }
      const reqbody = { ...gameinfo, questions: questions }
      const url = 'http://localhost:5005/admin/quiz/' + gameid
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
            // handleOpenSubmitQuestion()
            data.json().then(response => {
              setMessage('Your question is updated successfully!')
              setTitle('Success')
              setModalShow(true)
            })
          } else {
            data.json().then(response => {
              setMessage(response.error)
              setTitle('Error')
              setModalShow(true)
            })
          }
        })
    }
  }

  function submitGame () {
    const gCheck = checkGamename()
    if (gCheck) {
      const reqbody = { ...gameinfo, name: gamename.current, thumbnail: gameimg }
      const url = 'http://localhost:5005/admin/quiz/' + gameid
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
            data.json().then(response => {
              console.log(response)
              setMessage('Your game is updated successfully!')
              setTitle('Success')
              setModalShow(true)
            })
          } else {
            data.json().then(response => {
              setMessage(response.error)
              setTitle('Error')
              setModalShow(true)
            })
          }
        })
    }
  }

  // Input component for file input
  const Input = styled('input')({
    display: 'none',
  });
  const [message, setMessage] = useState()
  const [title, setTitle] = useState()
  const [modalShow, setModalShow] = useState(false)
  const location = useParams()
  const navigate = useNavigate()
  function handleModal () {
    let nav
    if (!location.questionId) {
      nav = '/edit/' + gameid + '/0'
    } else {
      nav = '/edit/' + gameid
    }
    setModalShow(false)
    navigate(nav)
  }

  return (
    <Edit>
      {game &&
        <div>
          <h1 style={{ margin: '40px', color: '#3887c4' }}>Update your game</h1>
          <div className='gamename'>
            <TextField
              required
              id="outlined-required"
              label="Game Name"
              defaultValue={gamename.current}
              onBlur={handleGamename}
              style={{ margin: '10px' }}
            />
            <Notice className='notice'>Please provide a game name.</Notice>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Card
              elevation={3}
              sx={{
                p: 2,
                margin: 2,
                maxWidth: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FormControl
                elevation={3}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                className='attachment'
              >
                <FormLabel id="demo-radio-buttons-group-label">Thumbnail</FormLabel>
                <Box
                  sx={{
                    // width: 300,
                    m: 2,
                    height: 300,
                    minWidth: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // bgcolor: 'black',
                    // overflow: 'hidden',
                  }}
                >
                  <img height="100%" max-height="100%" width="auto" src={gameimg} alt="Thumbnail Image"/>
                </Box>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <label htmlFor="contained-button-file">
                    <Input
                      onChange={handleGameimg}
                      accept="image/*"
                      id="contained-button-file"
                      multiple type="file"
                    />
                    <Button variant="outlined" component="span">
                      Upload Image
                    </Button>
                  </label>
                </Stack>
                <Notice className='notice'>Please provide your attachment.</Notice>
              </FormControl>
            </Card>
          </div>
          <Button variant='contained' sx={{ backgroundColor: '#2597ef', '&:hover': { backgroundColor: '#BCDFFA', color: '#3887c4', fontWeight: 'bold' }, '&:active': { top: 2 } }} onClick={submitGame}>Update</Button>
        </div>
      }
      {!game &&
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'center',
          }}
        >
          {add &&
            <h1 style={{ marginTop: '40px', color: '#3887c4' }}>New Question</h1>
          }
          {!add &&
            <h1 style={{ marginTop: '40px', color: '#3887c4' }}>Question {qid}</h1>
          }
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Card
              className='question'
              sx={{
                p: 2,
                paddingBottom: 4,
                margin: 2,
                width: '100%',
                maxWidth: 700,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FormLabel id="demo-radio-buttons-group-label" sx={{ marginBottom: 1 }}>Question</FormLabel>
              <TextField
                sx={{
                  m: 2,
                  marginTop: 0,
                  marginBottom: 0,
                  maxWidth: 700,
                }}
                required
                fullWidth
                id="question-title-input"
                label="Question"
                defaultValue={question.current}
                onBlur={handleQuestion}
              />
              <Notice className='notice'>Please provide the question.</Notice>
            </Card>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Card
              elevation={3}
              sx={{
                p: 2,
                margin: 2,
                maxWidth: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FormControl
                elevation={3}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                className='attachment'
              >
                <FormLabel id="demo-radio-buttons-group-label">Attachment</FormLabel>
                {attachmentType === 'img' &&
                  <Box
                    sx={{
                      // width: 300,
                      height: 300,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      // bgcolor: 'black',
                      // overflow: 'hidden',
                    }}
                  >
                    <img height="100%" max-height="100%" width="auto" src={attachmentImg} alt="attachment image"/>
                  </Box>
                }
                {attachmentType === 'video' &&
                  <iframe
                  width="600"
                  height="380"
                  src={attachmentVideo}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Embedded youtube"
                  />
                }
                <RadioGroup
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                  row aria-labelledby="demo-radio-buttons-group-label" defaultValue={attachmentType} name="radio-buttons-group" onChange={e => setAttachmentType(e.target.value)}
                >
                  <FormControlLabel value='img' control={<Radio />} label="Image" />
                  <FormControlLabel value='video' control={<Radio />} label="Video" />
                  <FormControlLabel value='none' control={<Radio />} label="None" />
                </RadioGroup>
                {attachmentType === 'img' &&
                  (
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <label htmlFor="contained-button-file">
                      <Input onChange={handleQuestionimg} accept="image/*" id="contained-button-file" multiple type="file" />
                      <Button variant="outlined" component="span">
                        Upload Image
                      </Button>
                    </label>
                  </Stack>
                  )
                  // <input type='file' accept="image/*" onChange={handleQuestionimg}/>
                }
                <Notice className='notice'>Please provide your attachment.</Notice>
                {attachmentType === 'video' &&
                <div>
                  <TextField
                    sx={{
                      height: '100%',
                    }}
                    required
                    id="outlined-required"
                    label="Youtube URL"
                    type="url"
                    defaultValue={attachmentVideo}
                    onBlur={handleQuestionvideo}
                    helperText="Please enter your Youtube URL here"
                  />
                </div>
                }
              </FormControl>
            </Card>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Card
              elevation={3}
              sx={{
                p: 2,
                margin: 2,
                width: '100%',
                maxWidth: 700,
              }}
            >
              <FormControl
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FormLabel id="demo-radio-buttons-group-label">Question type</FormLabel>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" defaultValue={choice} name="radio-buttons-group" onChange={handleChoice}>
                    <FormControlLabel value={true} control={<Radio />} label="Multiple choice" />
                    <FormControlLabel value={false} control={<Radio />} label="Single choice" />
                  </RadioGroup>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <div className='timelimit' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <TextField
                          sx={{
                            m: 2,
                            marginBottom: 0,
                          }}
                          fullWidth
                          label="Time Limit"
                          id="time-limit-input"
                          type="number"
                          defaultValue={timelimit.current}
                          onBlur={handleTimelimit}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                            inputProps: { min: 0 }
                          }}
                        />
                        <Notice className='notice'>Please provide a valid time limit.</Notice>
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div className='point' style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                          sx={{
                            m: 2,
                          }}
                          fullWidth
                          label="Points"
                          id="question-point-input"
                          type="number"
                          defaultValue={point.current}
                          onBlur={handlePoint}
                          InputProps={{
                            inputProps: { min: 0 }
                          }}
                        />
                        <Notice className='notice'>Please provide a valid point.</Notice>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </FormControl>
            </Card>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Card
              elevation={3}
              sx={{
                p: 2,
                margin: 2,
                width: '100%',
                maxWidth: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                className='correctanswer'
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FormLabel id="demo-radio-buttons-group-label">Answers</FormLabel>
                <FormControl sx={{ m: 2, marginBottom: 0, minWidth: 200, maxWidth: 700 }}>
                  <InputLabel id="demo-simple-select-label">Correct answer</InputLabel>
                  <Select
                    multiple={choice}
                    labelId="demo-simple-select-label"
                    id="answer-select"
                    defaultValue={correctAnswer.current}
                    label="Correct answer"
                    onChange={handleCorrectAnswer}
                  >
                    <MenuItem value='0'>Answer 1</MenuItem>
                    <MenuItem value='1'>Answer 2</MenuItem>
                    <MenuItem value='2'>Answer 3</MenuItem>
                    <MenuItem value='3'>Answer 4</MenuItem>
                    <MenuItem value='4'>Answer 5</MenuItem>
                    <MenuItem value='5'>Answer 6</MenuItem>
                  </Select>
                </FormControl>
                <Notice className='notice'>Please provide the correct answer.</Notice>
                <div className='answer' style={{ display: 'flex', justifyContent: 'center' }}>
                  <Grid
                    container
                    rowSpacing={2}
                    columnSpacing={2}
                    sx={{ m: 2, marginTop: 0, maxWidth: 700 }}>
                    <Grid item xs={6}>
                      <div>
                        <TextField
                          required
                          fullWidth
                          className="answer"
                          label="Answer 1"
                          id="answer1-input"
                          defaultValue={answer.current[0]}
                          onBlur={event => { answer.current = { ...answer.current, 0: event.target.value } }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div>
                        <TextField
                          required
                          fullWidth
                          className="answer"
                          label="Answer 2"
                          id="answer2-input"
                          defaultValue={answer.current[1]}
                          onBlur={event => { answer.current = { ...answer.current, 1: event.target.value } }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div>
                        <TextField
                          fullWidth
                          className="answer"
                          label="Answer 3"
                          id="answer3-input"
                          defaultValue={answer.current[2]}
                          onBlur={event => { answer.current = { ...answer.current, 2: event.target.value } }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div>
                        <TextField
                          fullWidth
                          className="answer"
                          label="Answer 4"
                          id="answer4-input"
                          defaultValue={answer.current[3]}
                          onBlur={event => { answer.current = { ...answer.current, 3: event.target.value } }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div>
                        <TextField
                          fullWidth
                          className="answer"
                          label="Answer 5"
                          id="answer5-input"
                          defaultValue={answer.current[4]}
                          onBlur={event => { answer.current = { ...answer.current, 4: event.target.value } }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div>
                        <TextField
                          fullWidth
                          className="answer"
                          label="Answer 6"
                          id="answer6-input"
                          defaultValue={answer.current[5]}
                          onBlur={event => { answer.current = { ...answer.current, 5: event.target.value } }}
                        />
                      </div>
                    </Grid>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 0 }}>
                      <Notice className='notice'>Please provide at least two answers.</Notice>
                    </div>
                  </Grid>
                </div>
              </div>
            </Card>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {add &&
              <div>
                <Button
                  sx={{
                    m: 2,
                    marginBottom: 4,
                    size: 'large',
                    width: '100%',
                    maxWidth: 700,
                    backgroundColor: '#2597ef',
                    '&:hover': { backgroundColor: '#BCDFFA', color: '#3887c4', fontWeight: 'bold' },
                    '&:active': { top: 2 }
                  }}
                  id='add-btn'
                  variant='contained'
                  onClick={submitQuestion}
                >
                  Add
                </Button>
              </div>
            }
            {!add &&
              <div>
                <Button
                  sx={{
                    m: 2,
                    marginBottom: 4,
                    size: 'large',
                    width: '100%',
                    maxWidth: 700,
                    backgroundColor: '#2597ef',
                    '&:hover': { backgroundColor: '#BCDFFA', color: '#3887c4', fontWeight: 'bold' },
                    '&:active': { top: 2 }
                  }}
                  variant='contained'
                  onClick={submitQuestion}
                >
                  Update
                </Button>
              </div>
            }
          </div>
        </div>
      }
      <Errorpopup show={modalShow} onHide={handleModal} message={message} title={title} ></Errorpopup>
    </Edit>
  )
}

EditQuestion.propTypes = {
  qid: PropTypes.number,
  gameinfo: PropTypes.array,
  questions: PropTypes.array,
  gameid: PropTypes.string
}
export default EditQuestion;
