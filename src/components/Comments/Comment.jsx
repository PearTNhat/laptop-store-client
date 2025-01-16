/* eslint-disable react/prop-types */
import moment from "moment"
import { DefaultUser } from "~/assets/images"
import { TiMessages } from "react-icons/ti";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { IoTrashOutline } from "react-icons/io5";
import { convertNumberToStar } from "~/utils/helper";
import CommentForm from "./CommentForm";
import { useState } from "react";

function Comment({ 
    userId, 
    comment, 
    isAdmin, 
    replies=[], 
    parentId,
    affectedComment,
    setAffectedComment,
    handleSubmitComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLikeComment,
}) {
    const isBelongToUser = userId === comment.user?._id
    const liked = comment.likes.includes(userId)
    const replyCommentId = parentId ? parentId : comment._id
    const isReply = affectedComment?.type === "REPLY" && affectedComment?.id === comment._id
    const isEdit = affectedComment?.type === "EDIT" && affectedComment?.id === comment._id
    const [clickLike, setClickLike] = useState(false)
    console.log(liked,clickLike)
    return (
        <div className={`mt-4`}>
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
                    <p className="text-sm">{comment.replyOnUser && comment.replyOnUser._id !== comment.user._id  && <span className="text-blue-500 leading-[16px]">@{comment.replyOnUser.firstName + ' '+comment.replyOnUser.lastName}</span>} {comment.content}</p>
                    <div className="flex mt-1 gap-2 text-[14px]">
                        <button className="flex justify-center items-center gap-1" onClick={()=>{
                            handleLikeComment({commentId:comment._id})
                            setAffectedComment(null)
                            setClickLike(!clickLike)
                            }}>
                            {liked || clickLike? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                            <span className="text-xs">{comment.likes.length} Like</span>
                        </button>
                        <button className="flex justify-center items-center gap-1" onClick={()=>{
                            setAffectedComment({type:"REPLY",id:comment._id})
                        }}>
                            <TiMessages />
                            <span className="text-xs">{replies.length} Reply</span>
                        </button>
                        {
                            (isBelongToUser && parentId ) &&
                            <button className="flex justify-center items-center gap-1"
                            onClick={()=>{
                            setAffectedComment({type:"EDIT",id:comment._id})
                            }}
                            >
                                <LuPencil />
                                <span className="text-xs">Edit</span>
                            </button>
                        }
                        {
                            (isBelongToUser ) &&
                            <button 
                            className="flex justify-center items-center gap-1"
                            onClick ={()=>handleDeleteComment({commentId:comment._id})}
                            >
                                <IoTrashOutline />
                                <span className="text-xs">Delete</span>
                            </button>
                        }
                    </div>
                </div>
                <div className="">
                    {/* show comment form to edit or reply */}
                    {
                        isReply &&
                        <CommentForm
                            confirmText={"Reply"}
                            setAffectedComment={setAffectedComment}
                            cancelHandler={() => setAffectedComment(null)}
                            handleSubmitComment={(content, rating) => handleSubmitComment({ content, rating, parentId: replyCommentId,replyOnUser:comment.user._id })}
                        />
                    }
                    {
                        isEdit &&
                            <CommentForm
                                confirmText={"Update"}
                                initValue={comment.content}
                                setAffectedComment={setAffectedComment}
                                cancelHandler={() => setAffectedComment(null)}
                                handleSubmitComment={(content) => handleUpdateComment({commentId:comment._id, content})}
                            />
                        
                    }
                    {/* show replies */}
                    {
                        replies?.map((reply) =>
                            <Comment
                                key={reply._id}
                                userId={userId}
                                comment={reply}
                                isAdmin={isAdmin}
                                affectedComment={affectedComment}
                                parentId={replyCommentId}
                                setAffectedComment={setAffectedComment}
                                handleSubmitComment={handleSubmitComment}
                                handleUpdateComment={handleUpdateComment}
                                handleDeleteComment={handleDeleteComment}
                                handleLikeComment={handleLikeComment}
                                replies={[]}
                            />
                        )
                    }    
                </div>
            </div>
        </div>
    )
}

export default Comment