import React from "react";

import {ButtonProps} from "./type";

const Button: React.FC<ButtonProps> = (props) => {
    const {
        isDisabled,
        title,
        type,
        onClick
    } = props
    return (
        <button
            type={type}
            className={`py-4 px-8 mt-12 rounded text-base font-medium text-white leading-[13px] w-full 
            ${!isDisabled ? 'bg-lavender cursor-not-allowed' : 'bg-purple cursor-pointer hover:bg-blue'}`}
            disabled={!isDisabled}
            onClick={onClick}
        >
            {title}
        </button>
    )
}

export default Button
