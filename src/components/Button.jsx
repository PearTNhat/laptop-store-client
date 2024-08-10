/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"

function Button({ leftIcon, rightIcon,wf, style, children, ...rest }) {
    let Comp = 'button'
    if (rest?.href) {
        Comp = 'a'
    } else if (rest?.to) {
        Comp = Link
    }
    return (
        <Comp
            className={`${style} ?
             ${style}
             :
             flex justify-center items-center leading-none px-2 py-3 text-white bg-main rounded-md
             ${wf ? 'w-full' : 'w-auto'}
             `
            }
            {...rest}
        >
            {leftIcon}
            {children}
            {rightIcon}
        </Comp>
    )
}

export default Button