/* eslint-disable react/prop-types */
import { useState } from "react"
import Button from "../Button"

function CommentForm({initValue='',cancelHandler,confirmText,handleSubmitComment,setAffectedComment}) {
  const [value, setValue] = useState(initValue)
  return (
    <div>
        <div className="">
            <textarea value={value} onChange={(e)=>setValue(e.target.value)} placeholder="Enter your comment"  className="w-full border border-gray-300 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-md p-2 focus:outline-none mt-4" rows="3"></textarea>
            <div className="flex justify-end gap-3 mt-2">
                {cancelHandler && <Button outline onClick={()=>setAffectedComment(null)} className={'!py-2'} >Cancel</Button>}
                <Button  className={'!py-2 !px-4'} onClick={()=>handleSubmitComment(value)}>{confirmText}</Button>
            </div>
        </div>
    </div>
  )
}

export default CommentForm