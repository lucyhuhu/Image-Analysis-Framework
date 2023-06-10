import React from 'react'
import './styles/Header.css'

/**
 * @returns Header div for the website
 */
const Header: () => JSX.Element = () => {
  return (
    <div id='header'>
      <img className='website-logo' src='/logo-icon.svg' alt='Pixel Insights Website Logo' />
      <div className='website-name'><strong>Pixel Insights</strong> | Image Data Graphing Libraries</div>
    </div>
  )
}

export default Header
