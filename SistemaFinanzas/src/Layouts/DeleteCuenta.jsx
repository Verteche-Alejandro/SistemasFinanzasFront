import Modal from "../Components/Modals/Modal";
import ButtonForm from "../Components/Buttons/ButtonForm";

const DeleteCuenta = ({ isOpen, onClose, onConfirm, accountName }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Eliminación" width="w-96">
            <div className="p-4">
                <p className="text-lg text-gray-700 mb-6">
                    ¿Estás seguro de que deseas eliminar la cuenta <strong>{accountName}</strong>?
                </p>
                <p className="text-gray-500 text-xs m-4">
                    Tambien se eliminaran todas las transacciones asocidas a esta cuenta
                </p>
                <div className="flex justify-end space-x-4">
                    <ButtonForm
                        text="Cancelar"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors">
                    </ButtonForm>
                    <ButtonForm
                        text="Confirmar"
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                    </ButtonForm>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteCuenta;