import { FrameworkFrontendImpl } from '../frameworkimpl'
import './styles/content.css'
import BackBtn from './BackBtn'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { Carousel } from 'react-responsive-carousel'

interface SelectVisPluginProps {
  framework: FrameworkFrontendImpl
  updateStage: (s: string) => void
}

/**
 * @param props The front-end framework and a means to update the front-end stage.
 * @returns Div that is to be displayed when the images and the Cloud Vision results
 * have been generated, and a visualization plugin is to be selected. The
 * list of plugins is determined by those that have registered with the framework.
 */
const SelectVisPlugin: (props: SelectVisPluginProps) => JSX.Element = (props: SelectVisPluginProps) => {
  const visPluginNames = props.framework.getVisPluginsNames()
  const images = props.framework.getImages()

  const handleSubmit = (e: any): void => {
    e.preventDefault()
    if (e.target.value !== '0') {
      props.framework.selectVisPlugin(e.target.value)
      props.updateStage('vis')
    }
  }

  return (
    <div id='select-vis' className='content-wrapper'>
      <BackBtn updateStage={props.updateStage} />
      <div className='content'>
        <div className='content-title'>We've processed your images,</div>
        <div className='content-descrp'>please select a method for visualization!</div>
        <div className='dropdown'>
          <select className='selector' name='cars' id='cars' onChange={handleSubmit}>
            <option value='0'>Select</option>
            {visPluginNames.map((pluginName, index) => <option key={index} value={pluginName}>{pluginName}</option>)}
          </select>
        </div>
        <Carousel className='carousel'>
          {images.map((base64, index) => (
            <div className='imageCarousel' key={index}>
              <img className='imageCarousel-img' src={'data:image/png;base64,' + base64} alt='' />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  )
}

export default SelectVisPlugin
