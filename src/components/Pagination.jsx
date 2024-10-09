/* eslint-disable react/prop-types */
import { memo } from "react"
import {DOTS,usePagination} from "~/hook/usePagination"
function Pagination({siblingCount, currentPage, totalPageCount, onPageChange}) {
  console.log(currentPage)
  const paginationRange = usePagination({siblingCount, currentPage, totalPageCount})
  const onPrevious = () => {
    onPageChange(currentPage - 1)
  }
  const onNext = () => {
    onPageChange(currentPage + 1)
  }
  return (
    <div className="flex items-center justify-center">
        <button
        type="button"
        disabled={currentPage === 1}
        className={`${currentPage === 1 && 'cursor-not-allowed disabled:bg-gray-200'
          } w-[40px] h-[40px] flex justify-center items-center text-base text-gray-600 bg-white border-t border-b border-l rounded-l-xl hover:bg-gray-100`}
        onClick={() => {
          onPrevious()
        }}
      >
        <svg width="9" fill="currentColor" height="8" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
          <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"></path>
        </svg>
      </button>
       {paginationRange.map((el,index)=>{
            if(el === DOTS){
                return <div key={index} className=" cursor-pointer w-[40px] h-[40px] flex justify-center items-center border border-gray-200  bg-white">{DOTS}</div>
            }
            return <button key={index} 
            className={`${currentPage === el ? 'bg-main text-white' : 'text-gray-600  hover:bg-gray-100'} cursor-pointer w-[40px] h-[40px] flex justify-center items-center  border border-gray-200`}
            onClick={()=>onPageChange(el)}
            >{el}</button>
        })}
        <button
        type="button"
        disabled={currentPage === totalPageCount}
        className={`${currentPage === totalPageCount && 'cursor-not-allowed disabled:bg-gray-200'
          } w-[40px] h-[40px] flex justify-center items-center text-base text-gray-600 bg-white border-t border-b border-r rounded-r-xl hover:bg-gray-100`}
        onClick={() => {
          onNext()
        }}
      >
        <svg width="9" fill="currentColor" height="8" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
          <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
        </svg>
      </button>
    </div>
  )
}

export default memo(Pagination)