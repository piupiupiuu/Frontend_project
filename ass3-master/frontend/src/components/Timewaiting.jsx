import PropTypes from 'prop-types'
import React from 'react'

export const Time = ({ t }) => {
  const dot = ['.', '..', '...', '....', '.....', '......']
  return (
    <div>{dot[t % 6]}</div>
  )
}
Time.propTypes = {
  t: PropTypes.number
}
