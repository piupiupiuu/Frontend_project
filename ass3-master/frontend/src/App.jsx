import { React } from 'react'
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { LoginScreen, SignUpPage, token, changeToken } from './screen/login'
import { Dashboard } from './screen/dashboard'
import { EditGame } from './screen/edit'
import { JoinGame } from './screen/join'
import { PlayGame } from './screen/play'
import { GameResult } from './screen/total_result'

function App () {
  /* if admin doesn't access the page by url, then admin can login with multiple accounts,
  otherwise only the last logged in account will be used for url fragmentation */
  if (token === false && localStorage.getItem('token') !== 'false') {
    changeToken(localStorage.getItem('token'))
  }
  return (
    <BrowserRouter>
      <Routes>
        {token &&
          <Route path='*' element={<Dashboard />} />
        }
        {!token &&
          <Route path='*' element={<LoginScreen />} />
        }
        <Route path='/login' element={<LoginScreen />} />
        <Route path='/register' element={<SignUpPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/edit/:gameId' element={<EditGame />}>
          <Route path=':questionId' element={<EditGame />} />
        </Route>
        <Route path='/game'>
          <Route path='join' element={<JoinGame />}>
            <Route path=':sessionid' element={<JoinGame/>}/>
          </Route>
          <Route path=':sessionId'>
            <Route path='play/:playerId' element={<PlayGame />} />
            <Route path='gameResult' element={<GameResult />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
