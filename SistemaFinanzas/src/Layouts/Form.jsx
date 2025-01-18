const Form = ({ children, onSubmit }) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col space-y-10">
                {children}
            </div>
        </form>
    );
}
export default Form