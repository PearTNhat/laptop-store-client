/* eslint-disable react/prop-types */


function InputField({nameKey,clsWrapInput=null,clsWrapIcon=null,value,type='text',setPayload=()=>{},invalidField=[],onChange=null, setInvalidField,icon, cssDiv, cssLabel, cssInput, placeholder ,...rest}) {
  const error = invalidField.find((item) => item.name === nameKey);
  const changeValueDefault = (e) => setPayload((prev) => ({ ...prev, [nameKey]: e.target.value }))
  return (
    <div className={`${cssDiv} relative`}>
        {
        (value===0 || value) &&
        <label htmlFor={nameKey} className={`${cssLabel}  select-none leading-none absolute z-10 bg-white text-gray-500 left-[9px] top-1/2 -translate-y-1/2 animate-slide-top-sm`}>
            {placeholder}
        </label>
        }
        <div className={`relative ${clsWrapInput}`}>
          <input  
              id={nameKey}
              type={type} 
              value={value}
              onChange={(e)=>{onChange  !== null ? onChange(e) : changeValueDefault(e)}}
              onFocus={()=>setInvalidField && setInvalidField(invalidField.filter(item => item.name !== nameKey))}
              placeholder={placeholder}
              className={`
                  ${error && 'border-red-500'} 
                  ${cssInput}
                  placeholder:text-dark-light border border-gray-400 rounded-md p-2 w-full outline-none focus:border-blue-500
                  `}
              {...rest}
          />
          <div className={`absolute w-fit ${clsWrapIcon} right-3 top-[50%] translate-y-[-50%] cursor-pointer`}>
            {icon}
          </div>
        </div>
        {error && <small className="text-red-500 mt-3">{error.mes}</small>}
    </div>
  )
}
// [{name:password, mes: Required}]
export default InputField