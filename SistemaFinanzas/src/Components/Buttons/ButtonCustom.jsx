import { useState } from "react";

const ButtonCustom = ({
    onClick,
    defaultText,
    hoverText,
    bgColor = "#83d7dd",
    textColor = "#f0fbfb", 
    hoverBgColor = "#276a77",
    hoverTextColor = "#f0fbfb",
    className = ""
}) => {
    const [text, setText] = useState(defaultText);
    const [textColorState, setTextColorState] = useState(textColor);

    const handleMouseEnter = () => {
        setText(hoverText);
        setTextColorState(hoverTextColor);
    };

    const handleMouseLeave = () => {
        setText(defaultText);
        setTextColorState(textColor);
    };

    return (
        <button
            className={`Btn ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{
                backgroundColor: bgColor,
                color: textColorState,
                "--hover-bg-color": hoverBgColor,
            }}
        >
            {text}
        </button>
    );
};

export default ButtonCustom;
