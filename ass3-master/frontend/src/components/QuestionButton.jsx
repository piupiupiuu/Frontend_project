import { React } from 'react'
import styled from '@emotion/styled'
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';

/* single question button */
export const Question = ({ id, qId }) => {
  const location = useParams()
  const navigate = useNavigate()
  let text, url
  if (id === '-1') {
    text = 'Add question'
    url = '/newquestion'
    return <div style={{ display: 'flex', justifyContent: 'center' }}>
             <Button
               id='add-question-btn'
               sx={{ m: 1, marginBottom: 2, backgroundColor: '#2597ef', '&:hover': { backgroundColor: '#BCDFFA', color: '#3887c4', fontWeight: 'bold' }, '&:active': { top: 2 } }}
               variant="contained"
               onClick={navigate.bind(null, '/edit/' + location.gameId + url)}
             >
               {text}
             </Button>
           </div>
  } else if (id === '0') {
    text = 'Game'
    url = ''
  } else {
    text = 'Question ' + id
    url = '/' + id
  }
  let style = {}
  if (id === qId) {
    style = { backgroundColor: '#E0E0E0' }
  }

  const QuestionItem = styled(MenuItem)({
    width: '100%',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: '#aca7a9',
      color: 'white'
    },
  })

  return <div style={{ width: '100%' }}>
           <QuestionItem
            style={style}
            onClick={navigate.bind(null, '/edit/' + location.gameId + url)}
          >
            {text}
          </QuestionItem>
        </div>
}
Question.propTypes = {
  id: PropTypes.string,
  qId: PropTypes.string
}
export default Question;
