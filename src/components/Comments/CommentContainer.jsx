/* eslint-disable react/prop-types */
import { useSelector, useDispatch } from "react-redux"
import { appActions } from "~/store/slice/app"
import Button from "../Button"
import VoteBar from "./VoteBar"
import RatingModal from "./RatingModal"
import { memo, useCallback, useEffect, useState } from "react"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { apiCreateComment, apiDeleteComment, apiLikeComment, apiUpdateComment } from "~/apis/comments"
import { Toast } from "~/utils/alert"
import Comment from "./Comment"
import YourRating from "./YourRating"

function CommentContainer({ title, pId, comments, totalRating,setFetchAgain }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [affectedComment, setAffectedComment] = useState(null)
  const { isLoggedIn, accessToken, userData, isAdmin } = useSelector((state) => state.user)
  const [rated,setRated] = useState({})
  const requireLogin = useCallback(async () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: "You need to login to comment",
        showCancelButton: true,
        confirmButtonText: "Login",
        confirmButtonColor: "#ee3131"
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(appActions.toggleModal({ isShowModal: false, childrenModal: false }))
          navigate('/login')
        }
      });
      return false
    }
    return true
  }, [isLoggedIn])
  const handleSubmitComment = async ({ rating, content, parentId,replyOnUser }) => {
    if (content.trim() === "") {
      Swal.fire({
        title: "Comment is required",
        icon: "info",
        confirmButtonColor: "#ee3131"
      })
      return
    }
    if( ! await requireLogin()) return
    const res = await apiCreateComment({ content, rating, pId, parentId, token: accessToken,replyOnUser })
    if (res.success) {
      Toast.fire({
        icon: "success",
        title: "Comment successfully",
      });
      dispatch(appActions.toggleModal({ isShowModal: false, childrenModal: false }))
    }
    setFetchAgain((prev) => !prev)
  }
  const handleUpdateComment = async ({commentId,content,rating}) => {
    const res = await apiUpdateComment({ content, rating, commentId, token: accessToken })
    if(res.success){
      Toast.fire({
        icon: "success",
        title: "Update comment successfully",
      });
      if(rating){
        dispatch(appActions.toggleModal({ isShowModal: false, childrenModal: false }))
      }
      setAffectedComment(null)
      setFetchAgain((prev) => !prev)
    }
  }
  const handleDeleteComment = async ({commentId}) => {
    const res = await apiDeleteComment({ commentId, token: accessToken })
    if (res.success) {
      Toast.fire({
        icon: "success",
        title: "Delete comment successfully",
      });
      setFetchAgain((prev) => !prev)
    }
  }
  const handleLikeComment = async ({commentId}) => {
    await apiLikeComment({ commentId, token: accessToken })
    setFetchAgain((prev) => !prev)
  }
  const handleClickShowModalRating = useCallback(async() => {
    if( !await requireLogin()) return
    dispatch(appActions.toggleModal({ isShowModal: true,animation:true, childrenModal: <RatingModal title={title} handleSubmitComment={handleSubmitComment} /> }))
  }, [title])
  const handleShowModalUpdateRating = useCallback(async () => {
    if( !await requireLogin()) return
    dispatch(appActions.toggleModal({ isShowModal: true,animation:true, childrenModal: <RatingModal title={title} rating = {rated.rating} content={rated.content} handleSubmitComment={({rating,content})=>handleUpdateComment({rating,content,commentId:rated._id})} /> }))
  }, [rated])
  useEffect(() => {
    setRated(comments?.find((comment) => comment.user._id === userData._id))
  }, [comments])
  return (
    <div>
      <div className="">
        <VoteBar totalRating={totalRating} comments={comments} />
       {rated ?
          <YourRating comment={rated} handleShowModalUpdateRating={handleShowModalUpdateRating} handleDeleteComment={handleDeleteComment} /> 
        :
        <div className="flex justify-center">
          <Button onClick={handleClickShowModalRating}>Đánh giá ngay</Button>
        </div>
        // <Comment
        // />     
      }
      </div>
      {
        comments?.map((comment) =>
          <Comment
            key={comment._id}
            userId={userData._id}
            comment={comment}
            isAdmin={isAdmin}
            affectedComment={affectedComment}
            setAffectedComment={setAffectedComment}
            handleSubmitComment={handleSubmitComment}
            handleUpdateComment={handleUpdateComment}
            handleDeleteComment={handleDeleteComment}
            handleLikeComment={handleLikeComment}
            replies={comment.replies}
          />
        )
      }
    </div>
  )
}

export default memo(CommentContainer) 