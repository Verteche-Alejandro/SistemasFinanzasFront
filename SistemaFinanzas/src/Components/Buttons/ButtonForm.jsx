const ButtonForm = ({ text, type = "button", onClick, className = "", icono }) => {
    return (
        <button
            type={type}
            className={`flex items-center justify-center p-2 rounded-lg text-[15px] font-bold border-2 transition-transform duration-300 shadow-none hover:-translate-y-0.5 hover:shadow-md ${className}`}
            onClick={onClick}>
            {icono && <span className="mr-2">{icono}</span>}
            {text}
        </button>
    );
};

export default ButtonForm;
