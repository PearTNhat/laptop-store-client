/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

function Button({ leftIcon, rightIcon, wf, style, className,children,outline, ...rest }) {
  let Comp = "button";
  if (rest?.href) {
    Comp = "a";
  } else if (rest?.to) {
    Comp = Link;
  }
  if(!rest?.type){
    rest.type = "button"
  }
  return (
    <Comp
      className={`${ style ? style : className+` leading-none px-2 py-3  ${outline ?'bg-white border border-main text-main' : 'text-white bg-main'} rounded-md` }
        ${wf ? "w-full" : "w-auto"}
      `}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </Comp>
  );
}

export default Button;
