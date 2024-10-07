/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux" 
import { appActions } from "~/store/slice/app"
function Modal({children}) {
  const dispatch = useDispatch()
  const handleClickModal = () => {
    dispatch(appActions.toggleModal({isShowModal:false,childrenModal:null}))
  }
  return (
    <div className="bg-black/10 absolute inset-0 z-50 flex items-center justify-center" onClick = {handleClickModal}>{children}</div>
  )
}

export default Modal