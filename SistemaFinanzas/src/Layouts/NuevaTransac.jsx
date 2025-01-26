import { useState } from "react";
import InputForm from "../Components/Inputs/InputForm";
import Modal from "../Components/Modals/Modal";
import { registrarTransaccion } from "../Services/Controllers/Transaccion";

const NuevaTransac = ({ isOpen, onClose }) => {
    const [transaccion, setTransaccion] = useState({
        monto: "",
        tipo_transaccion: "",
        fecha: new Date().toISOString().slice(0, 10), // Fecha actual en formato YYYY-MM-DD
        cuenta_id: "",
        moneda_id: ""
    });

    const Registrar = async () => {
        let rsp = await registrarTransaccion(transaccion);
        if (rsp) {
            console.log("Transacción registrada con éxito:", rsp);
            onClose();
        } else {
            console.error("Error al registrar la transacción");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nueva Transacción">
            <form className="space-y-4">
                <InputForm
                    label="Monto"
                    type="number"
                    name="monto"
                    value={transaccion.monto}
                    onChange={(e) => setTransaccion({ ...transaccion, monto: e.target.value })}
                    placeHolder="Ingrese el monto"
                />
                <div className="form-group">
                    <label className="block mb-2 text-sm font-medium">Tipo de Transacción</label>
                    <select
                        name="tipo_transaccion"
                        value={transaccion.tipo_transaccion}
                        onChange={(e) => setTransaccion({ ...transaccion, tipo_transaccion: e.target.value })}
                        className="bg-white rounded-lg py-2 px-2 border border-gray-300"
                    >
                        <option value="DEPOSITO">DEPOSITO</option>
                        <option value="RETIRO">RETIRO</option>
                        <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                        <option value="PAGO">PAGO</option>
                        <option value="AJUSTE">AJUSTE</option>
                    </select>
                </div>
                <InputForm
                    label="ID de Cuenta"
                    type="number"
                    name="cuenta_id"
                    value={transaccion.cuenta_id}
                    onChange={(e) => setTransaccion({ ...transaccion, cuenta_id: e.target.value })}
                    placeHolder="Ingrese el ID de la cuenta"
                />
                <div className="form-group">
                    <label className="block mb-2 text-sm font-medium">Moneda</label>
                    <select
                        name="moneda_id"
                        value={transaccion.moneda_id}
                        onChange={(e) => setTransaccion({ ...transaccion, moneda_id: e.target.value })}
                        className="bg-white rounded-lg py-2 px-2 border border-gray-300"
                    >
                        <option value="$ARG">$ARG</option>
                        <option value="$USD">$USD</option>
                    </select>
                </div>
                <InputForm
                    label="Fecha"
                    type="date"
                    name="fecha"
                    value={transaccion.fecha}
                    onChange={(e) => setTransaccion({ ...transaccion, fecha: e.target.value })}
                />
                <div className="flex justify-between space-x-4">
                    <button onClick={Registrar} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                        Registrar Transacción
                    </button>
                    <button className="bg-red-600 text-white mt-4 py-2 px-4 rounded">
                        Cancelar
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default NuevaTransac;