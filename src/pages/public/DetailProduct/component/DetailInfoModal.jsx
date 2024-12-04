/* eslint-disable react/prop-types */
function DetailInfoModal({ configs }) {
  return (
    <div className="w-[400px] h-full py-4" onClick={(e)=>e.stopPropagation()}>
      <div className=" bg-white rounded-md h-full px-4">
        <h2 className="font-semibold text-xl py-4 h-[60px] border-b border-b-gray-300">Thông số kỹ thuật</h2>
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
