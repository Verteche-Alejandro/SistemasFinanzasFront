import React from 'react';
import Modal from '../Components/Modals/Modal';
import InputForm from '../Components/Inputs/InputForm';
import ButtonForm from '../Components/Buttons/ButtonForm';

const ModalAlerta = ({ isOpen, onClose, onGuardar, montoAlarma, onChange,errores }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Configurar Alerta de Saldo" width="max-w-md">
            <div className="mb-4">
                <InputForm
                    label="Ingrese el monto mínimo para la alerta:"
                    type="number"
                    value={montoAlarma}
                    onChange={onChange}
                    placeholder="Ingrese el monto mínimo"
                />
                {errores && <p className="text-red-500 text-sm">{errores}</p>}
            </div>
            <div className="flex justify-end gap-4">
                <button
                    onClick={onClose}
                    className="button-editar mt-4">
                    Cancelar
                </button>
                <ButtonForm
                    text="Guardar alerta"
                    onClick={onGuardar}>
                </ButtonForm>
            </div>
        </Modal>
    );
};

export default ModalAlerta;