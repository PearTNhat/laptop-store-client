/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import { appActions } from "~/store/slice/app";
function Modal({ children ,animation=false }) {
  console.log(animation)
  const dispatch = useDispatch();
  const handleClickModal = () => {
    dispatch(
      appActions.toggleModal({ isShowModal: false, childrenModal: null })
    );
  };
  return (
    <div
      className="fixed p-1 w-full h-full  top-0 left-0 z-[9999] flex items-center justify-center"
      onClick={handleClickModal}
    >
      <div className="absolute inset-0 bg-black/10"></div>
      <div className={`h-full flex items-center ${animation && 'animate-slide-in-left'}`}>
        {children}
      </div>
    </div>
  );
}

export default Modal;
