import { FrameworkFrontendImpl } from '../frameworkimpl'
import './styles/SelectDataPlugin.css'
/* eslint-disable @typescript-eslint/no-floating-promises */

interface SelectDataPluginProps {
  framework: FrameworkFrontendImpl
  updateStage: (s: string) => void
}

/**
 * @param props The front-end framework and a means to update the front-end stage.
 * @returns Div that is to be displayed when initially selecting a data plugin. The
 * list of plugins is determined by those that have registered with the framework.
 */
const SelectDataPlugin: (props: SelectDataPluginProps) => JSX.Element = (props: SelectDataPluginProps): JSX.Element => {
  const dataPluginNames = props.framework.getDataPluginsNames()

  const handleSubmit = (e: any): void => {
    e.preventDefault()
    if (e.target.value !== '0') {
      props.framework.selectDataPlugin(e.target.value).then(
        () => {
          props.updateStage('input')
        }
      )
    }
  }

  return (
    <div id='select-data' className='content'>
      <div className='title'>Welcome to Pixel Insights,</div>
      <div className='descrp'>please first select a method for inputting images!</div>
      <div className='dropdown'>
        <select className='selector' name='cars' id='cars' onChange={(handleSubmit)}>
          <option value='0'>Select</option>
          {dataPluginNames.map((pluginName, index) => <option key={index} value={pluginName}>{pluginName}</option>)}
        </select>
      </div>
    </div>
  )
}

export default SelectDataPlugin
