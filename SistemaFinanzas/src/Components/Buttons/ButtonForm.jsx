const ButtonForm = ({ text, type, onClick, className = "", icono }) => {
    return (
        <button
            type={type}
            className={`botonform font-bold py-2 px-4 mt-4 rounded-lg focus:outline-none focus:shadow-outline ${className} inline-flex items-center`}
            onClick={onClick}>
            {icono && <span className="mr-2">{icono}</span>} {/* Renderiza el icono a la izquierda del texto */}
            {text}
        </button>
    );
};

export default ButtonForm;
