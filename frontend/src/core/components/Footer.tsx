import React from 'react'
import './styles/Footer.css'

interface FooterProps {
  dataPluginNames: string[]
  visPluginNames: string[]
}

/**
 * @returns Footer div for the website
 */
const Footer: (props: FooterProps) => JSX.Element = (props: FooterProps) => {
  return (
    <div id='footer'>
      <div className='footer-col logo'>
        <div className='website-logo-name'>
          <img className='website-logo' src='/logo-icon.svg' alt='Pixel Insights Website Logo' />
          <div className='website-name'><strong>Pixel Insights</strong> | Image Data Graphing Libraries</div>
        </div>
        <div className='credit'>by Bogdan Jonathan Fan Club Team</div>
      </div>

      <div className='footer-col dataplugins'>
        <div className='section-name'>Data Plugins</div>
        <div className='plugins'>
          {props.dataPluginNames.map((pluginName, index) => (
            <div className='plugin-name' key={index} id={pluginName}>- {pluginName}</div>
          ))}
        </div>

      </div>
      <div className='footer-col visplugins'>
        <div className='section-name'>Visualization Plugins</div>
        <div className='plugins'>
          {props.visPluginNames.map((pluginName, index) => (
            <div className='plugin-name' key={index} id={pluginName}>- {pluginName}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Footer
