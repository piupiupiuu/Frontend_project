import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from '@mui/material/Button'
import PropTypes from 'prop-types';
import LogoutIcon from '@mui/icons-material/Logout';

export function Errorpopup (props) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.message}
      </Modal.Body>
      <Modal.Footer>
        {props.cancel &&
        <Button onClick={props.onHide}>Cancel</Button>
        }
        {!props.quitgame &&
        <Button id='popup-close-btn' onClick={props.onHide}>Close</Button>
        }
        {props.quitgame &&
        <Button color="error" onClick={() => { props.navigate('/game/join') }}>Quit <LogoutIcon/></Button>
        }
      </Modal.Footer>
    </Modal>
  )
}
Errorpopup.propTypes = {
  onHide: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  quitgame: PropTypes.bool,
  navigate: PropTypes.func,
  cancel: PropTypes.bool
}
export default Errorpopup;
