const SelectForm = ({ label, name, value, disabled = false, options = [], titleOption, className = "", onChange }) => {
    return (
        <>
            <label htmlFor={name} className="block mb-2 text-sm font-medium text-[#254954]">
                {label}
            </label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`flex items-center  bg-white rounded-lg py-3 px-4 border border-[#83d7dd] 
                          transition-all duration-200 ease-in-out
                          hover:border-[#49bdc7] focus-within:border-[#2da0ad] focus-within:ring-2 
                          focus-within:ring-[#b5e8ec] focus-within:ring-opacity-50 ${className}`}
            >
                <option value="" disabled>{titleOption}</option>
                {options.map((option, index) => {
                    // Permitir que option sea objeto o string
                    const optionValue = typeof option === "object" ? option.value : option;
                    const optionLabel = typeof option === "object" ? option.label : option;
                    return (
                        <option key={index} value={optionValue}>
                            {optionLabel}
                        </option>
                    );
                })}
            </select>
        </>
    );
};

export default SelectForm;
