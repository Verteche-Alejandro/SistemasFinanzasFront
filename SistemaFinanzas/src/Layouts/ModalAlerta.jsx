import React from 'react';
import Modal from '../Components/Modals/Modal';
import InputForm from '../Components/Inputs/InputForm';
import ButtonForm from '../Components/Buttons/ButtonForm';

const ModalAlerta = ({ isOpen, onClose, onGuardar, montoAlarma, onChange, errores }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Configurar Alerta de Saldo" width="w-80">
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
                <ButtonForm
                    onClick={onClose}
                    className="bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white hover:border-white"
                    text="Cancelar">
                </ButtonForm>
                <ButtonForm
                    text="Guardar alerta"
                    onClick={onGuardar}
                    className="bg-white text-[#2da0ad] border-2 border-[#2da0ad] hover:bg-[#2da0ad] hover:text-white hover:border-white transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md">
                </ButtonForm>
            </div>
        </Modal>
    );
};

export default ModalAlerta;