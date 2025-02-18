import { useState } from "react";

const ButtonCustom = ({ defaultText, hoverText, className = "" }) => {
    // Estado para manejar el texto del botón
    const [text, setText] = useState(defaultText);

    // Manejo de eventos hover
    const handleMouseEnter = () => setText(hoverText);
    const handleMouseLeave = () => setText(defaultText);

    return (
        <button
            className={`Btn ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {text}
        </button>
    );
};

export default ButtonCustom;
