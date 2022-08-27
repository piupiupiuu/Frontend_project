import React from 'react';
import { shallow } from 'enzyme';
import Errorpopup from './components/Error';
// import Quizz from './components/QuizzInfo';
import Button from '@mui/material/Button'
import Answer from './components/Answer.jsx'
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Questionresult from './components/Questionresult'
import { Testinput } from './components/Testinput.jsx';
import { LoginButton, LoginInput } from './components/LoginPage.jsx'

// test 1
// check if the modal has the correct button for different props
describe('Error popup testing', () => {
  // check if the error popup has a close button
  it('default: The error popup should have a Close button', () => {
    const errorPopup = shallow(<Errorpopup />);
    expect(errorPopup.find(Button).get(0).props.children).toBe('Close');
  });

  // check if the error popup has a quit button
  it('Quit: The error popup should have a Quit button', () => {
    const errorPopup = shallow(<Errorpopup quitgame={true} />);
    expect(errorPopup.find(Button).get(0).props.children.at(0)).toBe('Quit ');
  });

  // check if the error popup has a cancel button
  it('Quit: The error popup should have a Cancel button', () => {
    const errorPopup = shallow(<Errorpopup cancel={true} />);
    expect(errorPopup.find(Button).get(0).props.children).toBe('Cancel');
  });
});

// test 2
// check if there's no text provided, the answer should not be displayed
// if there's text provided, the answer should be displayed
// the answer should be displayed with the given color
describe('Answer', () => {
  // if there's no text for the answer, the button should not be displayed
  it('no text, button should not display', () => {
    const props = {
      text: '',
      color: 'red',
      id: '1',
      type: true,
      choice: { current: ['2'] },
      playerId: '1'
    }
    const an = shallow(<Answer {...props}/>)
    expect(an.find(Button).get(0).props.sx).toHaveProperty(
      'display',
      'none',
    );
  })

  it('button should display with red color', () => {
    const props = {
      text: 'i',
      color: 'red',
      id: '1',
      type: true,
      choice: { current: ['2'] },
      playerId: '1'
    }
    const an = shallow(<Answer {...props}/>)
    expect(an.find(Button).get(0).props.sx).toHaveProperty(
      'backgroundColor',
      'red',
    );
  })

  it('button should display the text', () => {
    const props = {
      text: 'i',
      color: 'red',
      id: '1',
      type: true,
      choice: { current: ['2'] },
      playerId: '1'
    }
    const an = shallow(<Answer {...props}/>)
    expect(an.find(Button).get(0).props.children).toEqual('i')
  })
})

// test 3
// check if the true/false icon are displayed correctly
describe('QuestionResult', () => {
  // wrong answer should display X icon and not displaying the tick icon
  it('wrong answer', () => {
    const props = {
      id: 0,
      questionInfo: {
        current: {
          0: {
            timeLimit: 0
          }
        }
      },
      answerTime: [NaN],
      answerList: [],
      correct: [false]
    }
    const result = shallow(<Questionresult {...props}/>)
    expect(result.find(ClearIcon).length).toBe(1)
    expect(result.find(CheckIcon).length).toBe(0)
  })

  // correct answer should display the tick icon and not
  it('correct answer', () => {
    const props = {
      id: 0,
      questionInfo: {
        current: {
          0: {
            timeLimit: 2
          }
        }
      },
      answerTime: [NaN],
      answerList: [],
      correct: [true]
    }
    const result = shallow(<Questionresult {...props}/>)
    expect(result.find(ClearIcon).length).toBe(0)
    expect(result.find(CheckIcon).length).toBe(1)
  })
})

// test 4
// check if the input color will be changed once the button is clicked
describe('Testbutton', () => {
  it('Input color should be black if button is not clicked', () => {
    const ipt = shallow(<Testinput/>)
    expect(ipt.find(LoginInput).get(0).props.style).toHaveProperty('color', 'black')
  })

  it('Input color should change if button is clicked', () => {
    const ipt = shallow(<Testinput/>)
    ipt.find(LoginButton).simulate('click')
    expect(ipt.find(LoginInput).get(0).props.style).toHaveProperty('color', 'red')
  })
})
