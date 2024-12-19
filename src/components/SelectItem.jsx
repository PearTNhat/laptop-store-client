/* eslint-disable react/prop-types */
import Select from "react-select";

function SelectItem({
  value = null,
  invalidField,
  setInvalidField,
  ...rest
}) {
  const error = invalidField?.find((item) => item.name === rest.name  );
  let newValue = value;
  if (!value?.label) {
    newValue = null;
  }
  let attr = {
    ...rest,
    noOptionsMessage:() => "Vui lòng chọn thương hiệu"
  };

  return (
    <div>
      {value ? (
        <Select
          className="z-[9999]"
          classNamePrefix="react-select"
          {...attr}
          onFocusOut = {()=> setInvalidField && setInvalidField([])}
          value={newValue}
        />
      ) : (
        <Select
          className="z-[9999]"
          classNamePrefix="react-select"
          onFocusOut = {()=> setInvalidField && setInvalidField([])}
          {...attr}
        />
      )}
      {error && <span className="text-red-500">{error.mes}</span>}
    </div>
  );
}

export default SelectItem;
