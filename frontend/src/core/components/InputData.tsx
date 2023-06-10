import { useState } from 'react'
import { FrameworkFrontendImpl } from '../frameworkimpl'
import BackBtn from './BackBtn'
import './styles/content.css'
import ReactLoading from 'react-loading'
/* eslint-disable @typescript-eslint/no-floating-promises */

interface InputDataProps {
  framework: FrameworkFrontendImpl
  updateStage: (s: string) => void
}

/**
 * @param props The front-end framework and a means to update the front-end stage.
 * @returns Div that is to be displayed during the data inputting phase. The layout
 * of the form is determined by the active data plugin. This div will also generate
 * as a loading screen after form submission, but before recieving a response from
 * the back-end.
 */
const InputData: (props: InputDataProps) => JSX.Element = (props: InputDataProps) => {
  const pluginName = props.framework.getCurrDataPluginName()
  const pluginDescription = props.framework.getCurrDataPluginDescription()
  const [isLoaded, setIsLoaded] = useState(true)

  const handleSubmit = (): void => {
    setIsLoaded(false)
    props.framework.sendData().then(
      () => {
        setIsLoaded(true)
        props.updateStage('visplugin')
      }
    )
  }

  return (
    <div id='input-data' className='content-wrapper'>
      <BackBtn updateStage={props.updateStage} />
      {isLoaded
        ? (
          <div className='content'>
            <div className='content-title'>You selected to use <strong>{pluginName}</strong></div>
            <div className='content-descrp'>{pluginDescription}</div>
            <div className='plugin-frontend'>
              {props.framework.getDataPluginComponent(handleSubmit)}
            </div>
          </div>
        )
        : (
          <div className='content'>
            <div className='content-title'>We are processing the images,</div>
            <div className='content-descrp'>please wait for just a bit longer!</div>
            <ReactLoading color='#645BFF' />
          </div>
        )}
    </div>
  )
}

export default InputData
