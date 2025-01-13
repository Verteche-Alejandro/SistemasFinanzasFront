
const ButtonForm = ({ text, type }) => {
    return (
        <button
            type={type}
            className="botonform font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
        >
            {text}
        </button>
    );
}
export default ButtonForm;