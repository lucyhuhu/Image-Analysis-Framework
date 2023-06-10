
interface BackBtnProps {
  updateStage: (s: string) => void
}
/**
 * @param props A means to update the stage.
 * @return A back button div that can be used to return to the data plugin
 * selection stage.
 */
const BackBtn: (props: BackBtnProps) => JSX.Element = (props: BackBtnProps): JSX.Element => {
  const handleBack = (e: any): void => {
    e.preventDefault()
    props.updateStage('dataplugin')
  }

  return (
    <button className='backBtn' onClick={handleBack}> {'< Back'} </button>
  )
}

export default BackBtn
