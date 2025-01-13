const InputForm = ({ label, type, name, value, onChange,placeHolder }) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input
                type={type}
                className="bg-white rounded-lg py-2 px-4 block w-full appearance-none leading-normal focus:outline focus:shadow-black"
                name={name}
                value={value}
                placeholder={placeHolder}
                onChange={onChange}
            />
        </div>
    );
}
export default InputForm;