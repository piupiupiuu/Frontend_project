import { React, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types';
import { MathComponent } from 'mathjax-react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Questionresult from './Questionresult';

export const QuestionSection = styled.div`
    overflow: auto;
    width: 100%;
    // border: 1px solid;
    flex-grow: 1;
    padding-top: 10px;
    margin-bottom: 30px;
    padding-bottom: 50px;
    &::-webkit-scrollbar {
      color: transparent;
      width: 6px;
    };
    &::-webkit-scrollbar-thumb {
      borderRadius: 10px;
      backgroundColor: grey;
    }
  `

export const ResultScreen = ({ playerId, setMessage, setMessagetitle, setErrorshow, questionInfo }) => {
  const [answerTime, setAnswertime] = useState([])
  const [correct, setCorrect] = useState([])
  const [answerList, setAnswerlist] = useState([])
  const [totalS, setTotalS] = useState(0)
  useEffect(() => {
    /* remove duplicate record in questionInfo */
    questionInfo.current = questionInfo.current.filter((v, i, a) => a.findIndex(v2 => (v2.questionId === v.questionId)) === i)
    const url = 'http://localhost:5005/play/' + playerId + '/results'
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

            /* answer time for each question */
            const answerTimelist = []
            /* correct or not for each question */
            const correctList = []
            /* player's answer for each question */
            const answerl = []
            let totalScore = 0
            for (let i = 0; i < response.length; i++) {
              const time = (Date.parse(response[i].answeredAt) - Date.parse(response[i].questionStartedAt)) / 1000
              answerTimelist.push(time)
              correctList.push(response[i].correct)
              answerl.push(response[i].answerIds)
              if (response[i].correct) {
                totalScore = totalScore + questionInfo.current[i].point / (Math.sqrt(time / parseInt(questionInfo.current[i].timeLimit)))
              }
            }
            setAnswertime(answerTimelist)
            setCorrect(correctList)
            setAnswerlist(answerl)
            setTotalS(totalScore)
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

  const ReportBox = styled(Box)({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  })

  return (
    <ReportBox>
      <h1 style={{ margin: '10px', display: 'flex', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
        Score: <b style={{ color: '#2597ef', marginLeft: '10px' }}> {(totalS).toFixed(2)}</b>
      </h1>
      <div style={{ fontSize: '12px', color: 'white' }}><MathComponent tex={String.raw`Score^* = \sum_{i=0}^n\frac{Point}{\sqrt{\frac{AnswerTime}{TimeLimit}}}`}/></div>
      {/* <div>Your final score: {(totalS).toFixed(2)}</div> */}
      <Divider sx={{ width: '85%', color: 'white' }}/>
      <QuestionSection>
        {questionInfo.current.map((q, index) => {
          return (
            <Questionresult key={index} id={index} questionInfo={questionInfo} answerTime={answerTime} answerList={answerList} correct={correct}/>
          )
        }
        )}
      </QuestionSection>
    </ReportBox>
  )
}
ResultScreen.propTypes = {
  playerId: PropTypes.string,
  setMessage: PropTypes.func,
  setMessagetitle: PropTypes.func,
  setErrorshow: PropTypes.func,
  questionInfo: PropTypes.object,
}
export default ResultScreen;
