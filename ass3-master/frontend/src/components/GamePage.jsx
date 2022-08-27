import { React, useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types';
import Button from '@mui/material/Button'
import Modal from 'react-bootstrap/Modal';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import LogoutIcon from '@mui/icons-material/Logout';
import Card from '@mui/material/Card';
import defaultImg from '../screen/default.png'
import Answer from './Answer';

export const GameScreen = ({ playerId, setResult, setMessage, setMessagetitle, setErrorshow, questionInfo, navigate }) => {
  const timelimit = useRef()
  const [questionNum, setQuestionNum] = useState()
  const [question, setQuesiton] = useState()
  const [attachmentType, setAttachmentType] = useState()
  const [attachment, setAttachment] = useState()
  const [answers, setAnswer] = useState([])
  const [point, setPoint] = useState()
  /* true = multiple choice */
  const [questionType, setQuestiontype] = useState()
  const choice = useRef([])
  const [resultshow, setResultshow] = useState(false)

  /* get the question info */
  const url = 'http://localhost:5005/play/' + playerId + '/question'
  useEffect(() => {
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
            console.log(response)
            setQuesiton(response.question.question)
            timelimit.current = parseInt(response.question.timeLimit)
            setAttachmentType(response.question.attachmentType)
            if (response.question.attachmentType === 'img') {
              setAttachment(response.question.attachmentImg)
            } else {
              setAttachment(response.question.attachmentVideo)
            }
            setAnswer(response.question.answers)
            setPoint(response.question.point)
            questionInfo.current.push(response.question)
            setQuestiontype(response.question.questionType)
            setQuestionNum(response.question.questionId + 1)
          })
        } else {
          data.json().then(response => {
            setMessage(response.error)
            setMessagetitle('Error')
            setErrorshow(true)
          })
        }
      })
  }, [])

  /* show result when time = 0 */
  function Resultpopup (props) {
    return (
      <Modal
        width='100%'
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Result
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.correct &&
            <div style={{ color: 'green' }}>Bingo! <InsertEmoticonIcon /></div>
          }
          {!props.correct &&
            <div style={{ color: 'red' }}>Wrong! <SentimentVeryDissatisfiedIcon /></div>
          }
          <span>Correct answers:</span>
          {props.answers.map((answer) => {
            return (
              <span style={{ color: 'green' }} key={answer.index}> {answer}</span>
            )
          }
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outlined"
            color="error"
            onClick={() => { navigate('/game/join') }}
          >
            Quit game
            <LogoutIcon />
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
  Resultpopup.propTypes = {
    onHide: PropTypes.func,
    correct: PropTypes.bool,
    point: PropTypes.string,
    answers: PropTypes.array
  }

  /* time counter */
  const correctAnswer = useRef([])
  const correct = useRef(false)
  const Timer = () => {
    const Clock = styled.div`
      text-align:center;
      background-color: #864cbf;
      color: white;
      width: 60px;
      height:60px;
      line-height:60px;
      border-radius: 50%;
      margin:auto 0;
    `
    const [time, setTime] = useState(timelimit.current)
    const timeRef = useRef()
    useEffect(() => {
      if (time > 0) {
        timeRef.current = setTimeout(() => {
          timelimit.current--
          setTime(time - 1)
        }, 1000)
      }
      if (time === 0) {
        /* get the correct answer when time hits 0 */
        const url = 'http://localhost:5005/play/' + playerId + '/answer'
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
                /* check if the answer is correct */
                if (JSON.stringify(response.answerIds.sort()) === JSON.stringify(choice.current.sort())) {
                  correct.current = true
                }
                const correctAnswertext = []
                for (let i = 0; i < response.answerIds.length; i++) {
                  correctAnswertext.push(answers[response.answerIds[i]])
                }
                correctAnswer.current = correctAnswertext
                setResultshow(true)
                /* pulling next question */
                const url = 'http://localhost:5005/play/' + playerId + '/question'
                const interval = window.setInterval(() => {
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
                          if (response.question.questionId >= questionNum) {
                            setResultshow(false)
                            setQuesiton(response.question.question)
                            timelimit.current = parseInt(response.question.timeLimit)
                            setAttachmentType(response.question.attachmentType)
                            if (response.question.attachmentType === 'img') {
                              setAttachment(response.question.attachmentImg)
                            } else {
                              setAttachment(response.question.attachmentVideo)
                            }
                            setAnswer(response.question.answers)
                            setPoint(response.question.point)
                            questionInfo.current.push(response.question)
                            choice.current = []
                            correct.current = false
                            setQuestiontype(response.question.questionType)
                            setQuestionNum(response.question.questionId + 1)
                            clearInterval(interval)
                          }
                        })
                      } else {
                        data.json().then(response => {
                          /* the session has end, display the result */
                          setResult(true)
                          setResultshow(false)
                          clearInterval(interval)
                        })
                      }
                    })
                }, 1000)
                return () => clearInterval(interval);
              })
            }
          })
      }
      return () => {
        clearTimeout(timeRef.current)
      }
    }, [time])

    return (
      <Clock><b>{time}</b></Clock>
    )
  }

  const GameContent = styled.div`
    display:flex;
    flex-direction:column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height:100%;
  `
  const QContent = styled.div`
    width: 90%;
    padding: 0 5%;
    display:flex;
    align-items: center;
    justify-content: space-around;
    height: 300px;
    position:relative;
    margin: 10px;
    & > div {
      text-align:center;
      width: 60px;
      height: 60px;
      line-height: 60px;
      border-radius: 50%;
    }
  `

  const Answers = styled.div`
    flex-grow:1;
    width: 100%;
    display:flex;
    justify-content: center;
    flex-wrap: wrap;
    padding: 20px;
    & > div {
      flex-grow:1;
      width: 100%;
      max-width: 900px;
      display:flex;
      justify-content: center;
      flex-wrap: wrap;
      padding: 20px;
      gap: 10px;
    }
    & > div > button {
      width: 48%;
      border-radius: 10px;
    }
  `

  const Question = styled.div`
    // border:1px solid;
    width: 100%;
    max-width: 940px;
    display: flex;
    justify-content: center;
  `
  return (
    <GameContent>
      <Question>
        <Card sx={{ m: 2, width: '100%', p: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', boxShadow: '0px 15px 25px rgba(0,0,0, 0.2)' }}>
          <h4>Question {questionNum}</h4>
          <h1><b>{question}</b></h1>
        </Card>
      </Question>
      <QContent>
        <Timer />
        {attachmentType === 'img' &&
          <img width="57%" src={attachment} height="90%" alt="attached image" />
        }
        {attachmentType === 'video' &&
          <iframe
            width="57%"
            height="100%"
            frameBorder="0"
            src={attachment}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
          />
        }
        {attachmentType === 'none' &&
          <img src={defaultImg} width="57%" height='90%' alt="default attached image"/>
        }
        <div style={{
          textAlign: 'center',
          backgroundColor: '#864cbf',
          color: 'white',
          width: '60px',
          height: '60px',
          lineHeight: '60px',
          borderRadius: '50%',
          margin: 'auto 0'
        }}>
            <b>{point} pt</b>
        </div>
      </QContent>
      <Answers>
        <Card sx={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.2)' }}>
          <Answer color='#e21b3c' id='0' text={answers[0]} choice={choice} type={questionType} playerId={playerId}/>
          <Answer color='#26890c' id='1' text={answers[1]} choice={choice} type={questionType} playerId={playerId}/>
          <Answer color='#c2711b' id='2' text={answers[2]} choice={choice} type={questionType} playerId={playerId}/>
          <Answer color='#1368ce' id='3' text={answers[3]} choice={choice} type={questionType} playerId={playerId}/>
          <Answer color='#dbaf1c' id='4' text={answers[4]} choice={choice} type={questionType} playerId={playerId}/>
          <Answer color='#6300c7' id='5' text={answers[5]} choice={choice} type={questionType} playerId={playerId}/>
        </Card>
      </Answers>
      <Resultpopup show={resultshow} correct={correct.current} answers={correctAnswer.current} point={point} />
    </GameContent>
  )
}
GameScreen.propTypes = {
  playerId: PropTypes.string,
  setResult: PropTypes.func,
  setMessage: PropTypes.func,
  setMessagetitle: PropTypes.func,
  setErrorshow: PropTypes.func,
  questionInfo: PropTypes.object,
  navigate: PropTypes.func
}
export default GameScreen;
