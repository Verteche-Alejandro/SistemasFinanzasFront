const InputForm = ({ label, type, name, value, onChange, placeHolder, icono, readOnly }) => {
    return (
        <div className="form-group">
            {label && (
                <label className="block mb-2 text-sm font-medium text-[#254954]">
                    {label}
                </label>
            )}
            <div className="relative flex items-center bg-white rounded-lg py-3 px-4 border border-[#83d7dd] 
                          transition-all duration-200 ease-in-out
                          hover:border-[#49bdc7] focus-within:border-[#2da0ad] focus-within:ring-2 
                          focus-within:ring-[#b5e8ec] focus-within:ring-opacity-50">
                {icono && (<div className="mr-3 text-[#288292]">{icono}</div>)}
                <input
                    type={type}
                    className="bg-transparent flex-1 outline-none text-[#133039] placeholder-[#288292]
                             focus:placeholder-[#276a77]"
                    name={name}
                    value={value}
                    placeholder={placeHolder}
                    onChange={onChange}
                    readOnly={readOnly}
                />
            </div>
        </div>
    );
}
export default InputForm