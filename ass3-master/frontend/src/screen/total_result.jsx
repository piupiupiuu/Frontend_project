import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { token } from './login.jsx'
import Nav from '../components/Nav.jsx'
import Page from '../components/Page.jsx'
import Box from '@mui/material/Box';
import { Bar } from 'react-chartjs-2';
import { MathComponent } from 'mathjax-react'
import LinearProgress from '@mui/material/LinearProgress';
import styled from '@emotion/styled'
import Divider from '@mui/material/Divider';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const GameResult = () => {
  const location = useParams()
  const sessionId = location.sessionId
  const [scoreStat, setScoreStat] = useState({})
  const [questionStat, setQuestionStat] = useState({})
  const [playerNum, setPlayernum] = useState(1)
  const [pcCorrect, setPcCorrect] = useState([])
  const [avgTime, setAvgTime] = useState([])
  const [chartlabel, setChartlabel] = useState([])
  /* get the question information (score) */
  useEffect(() => {
    const url = 'http://localhost:5005/admin/session/' + sessionId + '/status'
    fetch(url, {
      method: 'Get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
      .then(data => {
        if (data.status === 200) {
          data.json().then(response => {
            const NumPlayer = response.results.players.length
            setPlayernum(NumPlayer)
            const questionInfo = response.results.questions
            /* get the game result */
            /* score = point / sqrt((answer time / timelimit)) */
            fetch('http://localhost:5005/admin/session/' + sessionId + '/results', {
              method: 'Get',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: token
              }
            })
              .then(data => {
                if (data.status === 200) {
                  data.json().then(response => {
                    /* calculate the score for each player */
                    const playerScore = {}
                    console.log(questionInfo)
                    let answerTime
                    let sumScore = 0
                    /* answer time and number of people correct per question */
                    for (let q = 0; q < questionInfo.length; q++) {
                      sumScore = sumScore + parseInt(questionInfo[q].point)
                      questionInfo[q].numberCorrect = 0
                      questionInfo[q].avgTime = 0
                    }
                    console.log(response.results)
                    for (let i = 0; i < response.results.length; i++) {
                      let totalScore = 0
                      for (let j = 0; j < response.results[i].answers.length; j++) {
                        if (response.results[i].answers[j].answeredAt === null) {
                          answerTime = parseInt(questionInfo[j].timeLimit)
                        } else {
                          answerTime = (Date.parse(response.results[i].answers[j].answeredAt) - Date.parse(response.results[i].answers[j].questionStartedAt)) / 1000
                        }
                        if (response.results[i].answers[j].correct === true) {
                          questionInfo[j].numberCorrect = questionInfo[j].numberCorrect + 1
                          const score = parseInt(questionInfo[j].point)
                          const timelimit = parseInt(questionInfo[j].timeLimit)
                          totalScore = totalScore + score / Math.sqrt(answerTime / timelimit)
                        }
                        questionInfo[j].avgTime = questionInfo[j].avgTime + answerTime
                      }
                      playerScore[response.results[i].name] = totalScore
                    }
                    /* sort the score */
                    const sortedscore = Object.keys(playerScore)
                      .sort((key1, key2) => playerScore[key2] - playerScore[key1])
                      .reduce((obj, key) => ({
                        ...obj,
                        [key]: playerScore[key]
                      }), {})
                    const slicedscore = Object.fromEntries(
                      Object.entries(sortedscore).slice(0, 5)
                    )
                    /* calculate percentage correct */
                    const pCorrect = []
                    const avgT = []
                    const labels = []
                    for (let k = 0; k < questionInfo.length; k++) {
                      avgT.push(questionInfo[k].avgTime / NumPlayer)
                      pCorrect.push((questionInfo[k].numberCorrect) / NumPlayer)
                      labels.push(questionInfo[k].questionid + 1)
                    }
                    setChartlabel(labels)
                    setPcCorrect(pCorrect)
                    setAvgTime(avgT)
                    setScoreStat(slicedscore)
                    setQuestionStat(questionInfo)
                    console.log(avgTime)
                    console.log(questionStat)
                  })
                }
              })
          })
        }
      })
  }, [])

  const LeaderBoard = () => {
    const TopPlayer = styled.div`
      display: flex;
      align-items: center;
      gap: 20px;
    `
    const medal = { 0: { color: '#E6A61F' }, 1: { color: 'silver' }, 2: { color: 'bronze' }, 3: { color: 'grey' }, 4: { color: 'grey' }, 5: { color: 'grey' } }
    return (
      <Box sx={{ width: { xs: '100%' }, flex: 3 }}>
        {Object.keys(scoreStat).map(function (key, index) {
          return (
            <TopPlayer key={key}>
              <div style={{ display: 'flex', gap: '3px' }}><WorkspacePremiumIcon style={medal[index]}/><span style={medal[index]}>{index + 1}</span></div>
              <div>{key}</div>
              <Box sx={{ width: '100%' }}>
                <LinearProgress
                  style={{ height: '10px', borderRadius: '5px' }}
                  variant="determinate"
                  value={scoreStat[key] + 50}
                />
              </Box>
              <div style={medal[index]}>{scoreStat[key].toFixed(2)}</div>
            </TopPlayer>
          )
        })
        }
      </Box>
    )
  }

  const correctChart = {
    labels: chartlabel,
    datasets: [
      {
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: pcCorrect
      }
    ]
  }
  const timeChart = {
    labels: chartlabel,
    datasets: [
      {
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: avgTime
      }
    ]
  }
  const correctoptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Percentage of player is correct',
      }
    },
  };
  const avgoptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Averge answer time',
      }
    },
  };
  const leaderStyle = {
    margin: '10px',
    color: '#E6A61F'
  }

  const Result = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flexGrow: 1;
    overflow: auto;
    text-align: center;
    padding: 20px;
    &::-webkit-scrollbar {
      color: transparent;
      width: 6px;
    };
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: grey;
    };
  `
  return (
    <Page>
      <Nav />
      <Divider/>
      <Result>
        <div style={{ border: '1px', width: '100%', maxWidth: 700, padding: '10px 0', borderRadius: '15px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}>
          <div style={{ fontSize: '23px' }}><EmojiEventsIcon style={leaderStyle}/>Leader Board<EmojiEventsIcon style={leaderStyle}/></div>
          <Box
            sx={{
              maxWidth: 700,
              display: 'flex',
              gap: '20px',
              width: '100%',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px 40px',
              margin: 'auto'
            }}
          >
            <Box
              sx={{
                border: '4px solid #3887c4',
                maxWidth: '100px',
                maxHeight: '100px',
                minWidth: '100px',
                minHeight: '100px',
                textAlign: 'center',
                borderRadius: '50%',
                margin: 'auto 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              {playerNum} Players
            </Box>
            <LeaderBoard />
          </Box>
          <div style={{ fontSize: '12px' }}><MathComponent tex={String.raw`Score^* = \sum_{i=0}^n\frac{Point}{\sqrt{\frac{AnswerTime}{TimeLimit}}}`}/></div>
        </div>
        <Box
          sx={{
            width: '100%',
            maxWidth: 700,
            padding: '40px',
            margin: '30px 0',
            borderRadius: '15px',
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'
          }}
        >
          <Bar
            data={correctChart}
            options={correctoptions}
          />
          <Bar
            data={timeChart}
            options={avgoptions}
          />
        </Box>
      </Result>
    </Page>
  )
}
