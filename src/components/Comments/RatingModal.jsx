/* eslint-disable react/prop-types */
import { memo, useState } from "react"
import { useDispatch } from "react-redux";
import { Logo } from "~/assets/images"
import { IoClose } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import Button from "../Button";
import { appActions } from "~/store/slice/app";
const startText = ['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Perfect']
function RatingModal({ title,handleSubmitComment,rating=5,content='',confirmText="Submit" }) {
  const dispatch = useDispatch()
  const [hover, setHover] = useState(null);
  const [payload, setPayload] = useState({rating,content})
  return (
    <div className="w-[600px] bg-white rounded-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <div className="relative py-3 bg-gray-100 text-bl">
        <p className="font-bold text-xl pl-2">Đánh giá và nhận xét</p>
        <IoClose className="absolute top-1/2 -translate-y-1/2 right-0 pr-2 text-4xl cursor-pointer" onClick={()=>dispatch(appActions.toggleModal({isShowModal:false,childrenModal:null}))}/>
      </div>
      <div className="px-2">
        <img src={Logo} alt="digital world" className="pt-4 mx-auto" />
        <p className="text-xl font-medium py-4">{title}</p>
        <div className="flex justify-around items-center">
          {
            startText.map((el, index) => {
              const currentRating = index + 1
              return (
                <div  key={el}>
                  <label className="cursor-pointer" onMouseEnter={() => setHover(currentRating)}
                    onMouseLeave={() => setHover(null)}
                  >
                    <div className="">
                      <input
                        className="hidden"
                        type="radio"
                        name="rating"
                        value={payload.rating}
                        onChange={() => setPayload({...payload,rating:currentRating})}
                      />
                      <FaStar className={`${currentRating <= (hover || payload.rating) ? 'text-yellow-300' : 'text-gray-100'} mx-auto text-xl`}
                      />
                    </div>
                    <p className="text-[16px]">{el}</p>
                  </label>
                </div>
              )
            }
            )
          }
        </div>
        <textarea 
        placeholder="Enter your thoughts" 
        value={payload.content} 
        onChange={(e)=>setPayload({...payload,content:e.target.value})}
        className="w-full border border-gray-300 rounded-sm p-1 focus:outline-none mt-4" rows="4"></textarea>
        <Button wf className={'my-4'} onClick={()=>handleSubmitComment({rating:payload.rating,content:payload.content})}>{confirmText}</Button>
      </div>

    </div>
  )
}

export default memo(RatingModal)