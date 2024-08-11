/* eslint-disable react/prop-types */

function InputField({value,error, icon, cssDiv, cssLabel, cssInput, placeholder ,...rest}) {
  return (
    <div className={`relative ${cssDiv}`}>
        {
        value &&
        <label htmlFor={placeholder} className={`${cssLabel} leading-none absolute bg-white text-gray-500 left-[9px] top-1/2 -translate-y-1/2 animate-slide-top-sm`}>
            {placeholder}
        </label>
        }
        <input 
            id={placeholder}
            type="text" 
            placeholder={placeholder}
            className={`
                ${error && 'border-red-500'} 
                ${cssInput}
                placeholder:text-dark-light my-2 border border-gray-400 rounded-md p-2 w-full outline-none focus:border-blue-500
                `}
            {...rest}
        />
        {icon}
    </div>
  )
}

export default InputField