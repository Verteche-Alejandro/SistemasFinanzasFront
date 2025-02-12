const ButtonForm = ({ text, type, onClick, className = "" }) => {
    return (
        <button
            type={type}
            className={`botonform font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline ${className}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
};
export default ButtonForm;
