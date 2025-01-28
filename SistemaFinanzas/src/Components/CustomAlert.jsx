const CustomAlert = ({ title, messages, onClose }) => {
    return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md">
            <div className="flex justify-between items-start">
                <div className="flex-grow">
                    <p className="font-bold mb-2">{title}</p>
                    {Array.isArray(messages) ? (
                        <ul className="list-disc pl-5 space-y-1">
                            {messages.map((message, index) => (
                                <li key={index}>{message}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>{messages}</p>
                    )}
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-red-500 hover:text-red-700 ml-4"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export default CustomAlert;