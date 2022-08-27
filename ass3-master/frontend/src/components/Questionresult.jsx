import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Card from '@mui/material/Card';

export const Questionresult = ({ id, questionInfo, answerTime, answerList, correct }) => {
  const Question = styled.div`
    // border: 1px solid;
    margin: 20px; 
    position: relative;
  `
  const markStyle = {
    display: 'flex',
    gap: '8px',
    position: 'absolute',
    right: 0,
    top: 20,
    margin: 'auto',
  }
  return (
    <Card sx={{ m: 2, width: '90%', maxWidth: 700, margin: ' 20px auto' }}>
      <Question>
        <div style={{ display: 'flex' }}>
          <div><b>Question {id + 1}: {questionInfo.current[id].question}</b></div>
        </div>
        <div>
          <div>Time limit: <span style={{ color: 'green' }}>{parseInt(questionInfo.current[id].timeLimit)}s</span></div>
          {isNaN(answerTime[id])
            ? <div>You didn&apos;t answer the question.</div>
            : <div>You answered in <span style={{ color: 'green' }}>{answerTime[id]}s</span></div>
          }
          {typeof (answerList[id]) !== 'undefined' && answerList[id].length > 0 &&
          <div style={{ display: 'flex', gap: '10px' }}>
            <div>Your answer:</div>
            {answerList[id].map((value, index) => {
              return (
                <div key={index}>&apos;{questionInfo.current[id].answers[value]}&apos;</div>
              )
            }
            )}
          </div>
          }
        </div>
        {correct[id]
          ? <div style={markStyle}>
              <div style={{ color: '#2597ef' }}>+{(questionInfo.current[id].point / (Math.sqrt(answerTime[id] / parseInt(questionInfo.current[id].timeLimit)))).toFixed(2)} pt</div>
              <CheckIcon color="success"/>
            </div>
          : <div style={markStyle}>
              <div style={{ color: '#2597ef' }}>+0 pt</div>
              <ClearIcon color="error"/>
            </div>
        }
      </Question>
    </Card>
  )
}

Questionresult.propTypes = {
  id: PropTypes.number,
  questionInfo: PropTypes.object,
  answerTime: PropTypes.array,
  answerList: PropTypes.array,
  correct: PropTypes.array
}
export default Questionresult;
