import styled from '@emotion/styled'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card'
import Button from '@mui/material/Button';

export const LoginHeader = styled.h1`
  color: white;
  font-size: 40px;
  text-align: center;
`

export const LoginButton = styled(Button)({
  width: '100%',
  borderRadius: '20px',
  fontSize: '15px',
  letterSpacing: '1px',
  marginTop: '20px',
  backgroundColor: '#2597ef',
  '&:hover': {
    backgroundColor: '#BCDFFA',
    color: '#3887c4'
  }
})

export const LoginInput = styled.input`
  border: none;
  margin: 3px auto;
  font-size: 16px;
  padding: 4px 6px;
  background: transparent;
  color: white;
  outline: 0;
  border-bottom: 1px solid #999;
  ::-webkit-input-placeholder {
  color: #999;
  }
  &:focus {
    border-bottom: white solid 1px !important;
  }
`

export const Block = styled.div`
  width: 210px;
  margin: 20px auto;
  
`

export const LoginPage = styled(Box)({
  height: '100%',
  width: '100%',
  position: 'absolute',
  top: '0px',
  bottom: '0px',
  background: 'linear-gradient(to top right, rgb(95,90,226),rgb(174,80,167))',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})

export const Notice = styled.div`
  color: red;
  font-size: 12px;
  display: none;
`

export const LoginPageContainer = styled(Card)({
  borderRadius: '20px',
  width: '100%',
  maxWidth: '500px',
  background: 'rgba(255,255,255,0.1)',
  color: 'white',
  padding: '40px',
  boxShadow: '0px 15px 25px rgba(0,0,0,.5)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})
export default LoginPage;
