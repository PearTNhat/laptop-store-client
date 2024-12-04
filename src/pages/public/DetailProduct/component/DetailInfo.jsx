/* eslint-disable react/prop-types */

import { appActions } from "~/store/slice/app";
import DetailInfoModal from "./DetailInfoModal";
import { useDispatch } from "react-redux";

function DetailInfo({ configs }) {
  const dispatch = useDispatch();
  const shortInfo = [];
  let configsArr =Object.keys(configs||{})?.map((key) => {
    if (!configs[key].description) {
      return null;
    }
    if(['CPU', 'RAM', 'Ổ cứng', 'Card đồ họa', 'Cổng kết nối','Kích thước màn hình','Hệ điều hành','Độ phân giải màn hình'].includes(configs[key].name)){
      shortInfo.push(configs[key]);
    }
    return configs[key] ;
  }) ;
  configsArr = configsArr.filter((item) => item !== null);
  configsArr.sort((a, b) => a.priority - b.priority);
  const handleClickViewDetail = () => {
    dispatch(appActions.toggleModal({isShowModal: true,animation:true, childrenModal: <DetailInfoModal configs={configsArr} />}));
  }
  return (
    <div className="shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] p-4 rounded-md">
      <h2 className="font-semibold text-xl mb-4">Thông số kỹ thuật</h2>
      <div className="info-container text-sm shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] my-2 rounded-md">
        {shortInfo?.map((config) => (
                <div className="info-item flex gap-2 p-2" key ={config.name}>
                  <div className="flex-4 flex items-center">{config.name}</div>
                  <div className="flex-6"  
                  dangerouslySetInnerHTML={{
                      __html: config.description,
                    }}></div>
                </div>
            ))}
      </div>
      <button className="shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] w-full rounded-md h-8 mt-3" onClick={handleClickViewDetail}>Xem chi tiết</button>
    </div>
  );
}

export default DetailInfo;
