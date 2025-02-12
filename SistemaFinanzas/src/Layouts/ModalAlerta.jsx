import React from 'react';
import Modal from '../Components/Modals/Modal';
import InputForm from '../Components/Inputs/InputForm';

const ModalAlerta = ({ isOpen, onClose, onGuardar, montoAlarma, onChange }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Configurar Alerta de Saldo"
            width="max-w-md"
        >
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                    Ingrese el monto mínimo para la alerta:
                </label>
                <InputForm
                    type="number"
                    value={montoAlarma}
                    onChange={onChange}
                    placeholder="Ingrese el monto mínimo"
                />
            </div>
            <div className="flex justify-end gap-4">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={onGuardar}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Guardar
                </button>
            </div>
        </Modal>
    );
};

export default ModalAlerta;