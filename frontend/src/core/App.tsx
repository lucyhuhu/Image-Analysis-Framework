import React, { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import SelectDataPlugin from './components/SelectDataPlugin'
import SelectVisPlugin from './components/SelectVisPlugin'
import InputData from './components/InputData'
import ShowVis from './components/ShowVis'
import { FrameworkFrontendImpl } from './frameworkimpl'
import NoImages from './components/NoImages'

interface AppProps {
  framework: FrameworkFrontendImpl
}

function App (props: AppProps): JSX.Element {
  const [stage, setStage] = useState('dataplugin')

  const dataPluginNames = props.framework.getDataPluginsNames()
  const visPluginNames = props.framework.getVisPluginsNames()

  const handleStageUpdate = (s: string): void => {
    setStage(s)
  }

  return (
    <div className='App page-container'>
      <Header />

      <div className='content-wrap'>
        {stage === 'dataplugin'
          ? <SelectDataPlugin framework={props.framework} updateStage={handleStageUpdate} />
          : stage === 'input'
            ? <InputData framework={props.framework} updateStage={handleStageUpdate} />
            : stage === 'visplugin'
              ? (
                props.framework.getImages().length > 0
                  ? <SelectVisPlugin framework={props.framework} updateStage={handleStageUpdate} />
                  : <NoImages updateStage={handleStageUpdate} />
              )
              : <ShowVis framework={props.framework} updateStage={handleStageUpdate} />}
      </div>

      <Footer dataPluginNames={dataPluginNames} visPluginNames={visPluginNames} />
    </div>
  )
}

export default App
