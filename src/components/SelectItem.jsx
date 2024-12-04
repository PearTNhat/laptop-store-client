/* eslint-disable react/prop-types */
import Select from 'react-select';

function SelectItem({onChange,options,defaultValue,isClearable,isSearchable,placeholder}) {
  return (
    <Select
    className="z-50"
    classNamePrefix="select"
    isClearable={isClearable}
    isSearchable={isSearchable}
    options={options}
    onChange={onChange}
    placeholder={placeholder}
    defaultValue={defaultValue}
  />
  )
}

export default SelectItem