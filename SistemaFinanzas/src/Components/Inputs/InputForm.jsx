const InputForm = ({ label, type, name, value, onChange, placeHolder, icono}) => {
    return (
        <div className="form-group">
            {label && <label className="block mb-2 text-sm font-medium">{label}</label>}
            <div className="flex items-center bg-white rounded-lg py-2 px-2 border border-gray-300">
                {icono && (<div className="mr-2">{icono}</div>)}
                <input
                    type={type}
                    className="bg-transparent flex-1 outline-none"
                    name={name}
                    value={value}
                    placeholder={placeHolder}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}

export default InputForm;
