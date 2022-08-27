import { React } from 'react'
import PropTypes from 'prop-types';
import Button from '@mui/material/Button'

export const Answer = ({ text, color, id, type, choice, playerId }) => {
  function submitAnswer (id, type) {
    const btns = document.getElementsByClassName('answer')
    let currentChoice = choice.current
    /* if the answer has already been choosen, then cancel */
    if (currentChoice.includes(parseInt(id))) {
      currentChoice = currentChoice.filter(function (value, index, arr) {
        return value !== parseInt(id);
      });
      btns[parseInt(id)].style.border = 'none'
      btns[parseInt(id)].style.opacity = 1
    } else {
      if (type === true) {
        currentChoice.push(parseInt(id))
      } else {
        currentChoice = [parseInt(id)]
        for (let i = 0; i < btns.length; i++) {
          btns[i].style.border = 'none'
          btns[i].style.opacity = 1
        }
      }
      btns[parseInt(id)].style.borderRight = '8px solid grey'
      btns[parseInt(id)].style.borderBottom = '8px solid grey'
      btns[parseInt(id)].style.borderTop = '6px solid #000'
      btns[parseInt(id)].style.borderLeft = '6px solid #000'
      btns[parseInt(id)].style.opacity = 0.4
    }

    choice.current = currentChoice
    const url = 'http://localhost:5005/play/' + playerId + '/answer'
    const reqBody = { answerIds: currentChoice }
    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    })
      .then(data => {
        if (data.status !== 200) {
          data.json().then(response => {
            console.log(response)
          })
        }
      })
  }

  if (text === '') {
    return (
      <Button className='answer' onClick={submitAnswer.bind(null, id, type)} sx={{ backgroundColor: color, display: 'none' }}>{text}</Button>
    )
  }
  return (
    <Button
      className='answer'
      onClick={submitAnswer.bind(null, id, type)}
      sx={{
        backgroundColor: color,
        color: 'white',
        fontWeight: 'bold',
        '&:hover': { backgroundColor: 'rgba(212, 203, 203, 0.5)', border: '6px solid grey', color: '#3887c4', fontWeight: 'bold' },
        '&:active': { top: 4 }
      }}
    >
      {text}
    </Button>
  )
}
Answer.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.bool,
  choice: PropTypes.object,
  playerId: PropTypes.string
}
export default Answer;
