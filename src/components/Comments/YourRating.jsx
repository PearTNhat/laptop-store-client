/* eslint-disable react/prop-types */

import moment from "moment"
import { IoTrashOutline } from "react-icons/io5"
import { LuPencil } from "react-icons/lu"
import { DefaultUser } from "~/assets/images"
import { convertNumberToStar } from "~/utils/helper"

function YourRating({comment,handleShowModalUpdateRating,handleDeleteComment }) {
  return (
    <div className={`mt-4 pb-8 border-b border-b-gray-300`}>
            <div className="flex gap-1">
                <img className="w-7 h-7 rounded-full" src={comment.user?.avatar?.url ? comment.user?.avatar?.url : DefaultUser} alt={comment?.user?.lastName} />
                <p>{comment?.user?.firstName} {comment?.user?.lastName}</p>
            </div>
            <div className="ml-[32px]">
                {/* start */}
                <div className="flex items-center gap-2">
                    {comment?.rating && <div className="flex">{convertNumberToStar(comment?.rating).map((el, i) => <div key={i} className="text-yellow-300 text-[14px]">{el}</div>)}</div>}
                    <p className="text-xs text-gray-500">{moment(comment?.createdAt).fromNow()}</p>
                </div>
                {/* content */}
                <div className="mt-3 p-2 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-md">
                    <p>{comment.content}</p>
                    <div className="flex mt-1 gap-2 text-[14px]">
                        <button className="flex justify-center items-center gap-1"
                        onClick={handleShowModalUpdateRating}
                        >
                            <LuPencil />
                            <span className="text-xs">Edit</span>
                        </button>
                        <button 
                            className="flex justify-center items-center gap-1"
                            onClick ={()=>handleDeleteComment({commentId:comment._id})}
                            >
                                <IoTrashOutline />
                                <span className="text-xs">Delete</span>
                            </button>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default YourRating