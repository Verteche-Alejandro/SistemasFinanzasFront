import { useState } from "react";

const ButtonCustom = ({
    onClick,
    defaultText,
    hoverText,
    bgColor = "#83d7dd",  // Color por defecto: 300
    textColor = "#f0fbfb",  // Texto: 100
    hoverBgColor = "#276a77",  // Hover: 700
    hoverTextColor = "#f0fbfb",  // Hover: color de texto
    className = ""
}) => {
    // Estado para manejar el texto y color del texto
    const [text, setText] = useState(defaultText);
    const [textColorState, setTextColorState] = useState(textColor);  // Estado para el color del texto

    // Manejo de eventos hover
    const handleMouseEnter = () => {
        setText(hoverText);  // Cambiar al texto de hover
        setTextColorState(hoverTextColor);  // Cambiar color de texto al de hover
    };

    const handleMouseLeave = () => {
        setText(defaultText);  // Volver al texto por defecto
        setTextColorState(textColor);  // Volver al color de texto original
    };

    return (
        <button
            className={`Btn ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{
                backgroundColor: bgColor,
                color: textColorState,  // Usar el estado para el color del texto
                "--hover-bg-color": hoverBgColor,
            }}
        >
            {text}
        </button>
    );
};

export default ButtonCustom;
