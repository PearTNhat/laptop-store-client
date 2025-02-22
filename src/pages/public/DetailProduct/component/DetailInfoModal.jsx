/* eslint-disable react/prop-types */
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { appActions } from "~/store/slice/app";
function DetailInfoModal({ configs }) {
  const dispatch = useDispatch();
  return (
    <div className="sm:w-[400px] w-full h-full py-4" onClick={(e)=>e.stopPropagation()}>
      <div className=" bg-white rounded-md h-full px-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl py-4 h-[60px] border-b border-b-gray-300">Thông số kỹ thuật</h2>
          <div onClick={()=>dispatch(appActions.toggleModal({isShowModal: false, childrenModal: null}))} className="text-3xl cursor-pointer">
            <IoClose/>
          </div>
        </div>
        {/* 76 =40  + 36 */}
        <div className="info-container text-sm overflow-auto h-[calc(100%-76px)] py-2 ">
          {configs?.map((config) => (
            <div className="info-item flex gap-2 p-2" key={config.name}>
              <div className="flex-4 flex items-center">{config.name}</div>
              <div
                className="flex-6"
                dangerouslySetInnerHTML={{
                  __html: config.description,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DetailInfoModal;
