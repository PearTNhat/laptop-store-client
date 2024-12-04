import { memo } from "react"

/* eslint-disable react/prop-types */
function InputForm({cssParents,id,validate,label,register,error,...rest}) {
  return (
    <div className={cssParents + ' mt-1'}>
        {label && <label htmlFor={id}>{label}</label>}
        <input 
            type="text"
            id={id} 
            {...register(id,validate)}
            className={`${
                error[id] && '!border-red-500'
              } placeholder:text-dark-light border-[1px] border-text-dark-gray rounded-md p-2 w-full outline-none focus:border-primary`}
            {...rest}
        />
        <div className="h-[18px]">
          {error[id] && <small className="text-red-500">{error[id].message}</small>}
        </div>
    </div>
  )
}

export default memo(InputForm) 