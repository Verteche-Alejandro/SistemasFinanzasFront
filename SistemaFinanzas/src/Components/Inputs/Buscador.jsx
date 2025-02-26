import { useState } from "react";

const Buscador = ({ onSearch }) => {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.trim() === "") {
            onSearch("");
        }
    };

    return (
        <div className="flex bg-zinc-800 border border-zinc-700 rounded-md shadow text-white text-sm">
            <button
                className="text-white w-10 grid place-content-center"
                onClick={() => onSearch(inputValue)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </svg>
            </button>
            <input
                type="text"
                spellCheck="false"
                name="text"
                className="bg-transparent py-1.5 outline-none placeholder:text-zinc-400 w-40 "
                placeholder="Buscar por alias"
                value={inputValue}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default Buscador;
