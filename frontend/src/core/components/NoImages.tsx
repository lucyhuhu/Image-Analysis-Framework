import './styles/content.css'
import BackBtn from './BackBtn'

interface NoImagesProp {
  updateStage: (s: string) => void
}

/**
 * @param props The front-end framework and a means to update the front-end stage.
 * @returns Div that is to be displayed when the images and the Cloud Vision results
 * have been generated, and a visualization plugin is to be selected. The
 * list of plugins is determined by those that have registered with the framework.
 */
const NoImages: (props: NoImagesProp) => JSX.Element = (props: NoImagesProp) => {
  return (
    <div id='select-vis' className='content-wrapper'>
      <BackBtn updateStage={props.updateStage} />
      <div className='content'>
        <div className='content-title'>No images were produced!</div>
        <div className='content-descrp'>Go back and try again.</div>
      </div>
    </div>
  )
}

export default NoImages
