import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled'
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button'
import { token, changeToken } from '../screen/login.jsx'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const Nav = () => {
  const navigate = useNavigate()
  const Header = styled.h1`
    height:100%;
    margin:0 20px;
    padding: 12px 0;
    font-size:25px;
  `
  const Navigation = styled(BottomNavigation)({
    justifyContent: 'flex-start',
    // backgroundColor: '#534e4e',
    background: 'linear-gradient(to top right, rgb(95,90,226),rgb(174,80,167))',
    color: 'white',
    opacity: '0.8'
  })

  const LogoutButton = styled(BottomNavigationAction)({
    width: 100,
    color: 'white',
    position: 'absolute',
    borderRadius: '10px',
    right: '25px',
    ':hover': {
      backgroundColor: 'rgba(212, 203, 203, 0.1)',
      color: '#84d2ec'
    },
    ':active': {
      top: '2px'
    }
  })

  const HomeButton = styled(BottomNavigationAction)({
    maxWidth: 100,
    color: 'white',
    position: 'relative',
    borderRadius: '20px',
    ':hover': {
      backgroundColor: 'rgba(212, 203, 203, 0.1)',
      color: '#84d2ec',
      borderRadius: '10px'
    },
    ':active': {
      top: '2px'
    }
  })

  function logout () {
    fetch('http://localhost:5005/admin/auth/logout', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token
      },
    })
      .then(data => {
        if (data.status === 200) {
          navigate('/login')
          changeToken(false)
          localStorage.setItem('token', false)
        }
      })
  }

  const [openLogout, setLogoutOpen] = useState(false);

  const handleLogoutOpen = () => {
    setLogoutOpen(true);
  };

  const handleLogoutClose = () => {
    setLogoutOpen(false);
  };

  return (
    <div style={{ width: '100%', boxShadow: '0 0 5px black', zIndex: 900 }}>
      <Navigation showLabels>
        <Header>BigBrain!!!</Header>
        <HomeButton id='home-btn' label='Home' icon={<HomeIcon />} onClick={navigate.bind(null, '/dashboard')}/>
        <LogoutButton id='logout-btn' label='Logout' icon={<LogoutIcon />} onClick={handleLogoutOpen}/>
        <Dialog
          open={openLogout}
          onClose={handleLogoutClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Logout'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to logout?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLogoutClose}>Cancel</Button>
            <Button id='confirm-logout-btn' color="error" onClick={logout} autoFocus>
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Navigation>
    </div>
  )
}
export default Nav;
