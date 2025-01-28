import { useState } from "react";
import Modal from "../Components/Modals/Modal"
import InputForm from "../Components/Inputs/InputForm"
import { registrarTransaccion } from "../Services/Controllers/Transaccion";

const NuevaTransac = ({ isOpen, onClose, cuentas, onActualizarCuentas }) => {
    const [transaccion, setTransaccion] = useState({
        monto: "",
        tipo_transaccion: "",
        fecha: new Date().toISOString().slice(0, 10),
        cuenta: {
            cuenta_id: ""
        },
        moneda: {
            moneda_id: ""
        }
    });

    const Registrar = async (e) => {
        e.preventDefault();
        try {
            // Transformar los valores de los selects a números
            const datosTransaccion = {
                ...transaccion,
                monto: Number(transaccion.monto),
                fecha: transaccion.fecha,
                cuenta: {
                    cuenta_id: Number(transaccion.cuenta.cuenta_id)
                },
                moneda: {
                    moneda_id: Number(transaccion.moneda.moneda_id)
                }
            };

            console.log("Datos enviados:", datosTransaccion);
            let rsp = await registrarTransaccion(datosTransaccion);

            if (rsp) {
                console.log("Repsuesta del servidor: ", rsp);
                onActualizarCuentas(); // Actualizar los datos después de registrar
                onClose();
            }
        } catch (error) {
            console.error("Error al registrar la transacción:", error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nueva Transacción">
            <form onSubmit={Registrar} className="space-y-4">
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
                        <option value="">Seleccione tipo</option>
                        <option value="DEPOSITO">DEPOSITO</option>
                        <option value="RETIRO">RETIRO</option>
                        <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                        <option value="PAGO">PAGO</option>
                        <option value="AJUSTE">AJUSTE</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="block mb-2 text-sm font-medium">Cuenta</label>
                    <select
                        name="cuenta_id"
                        value={transaccion.cuenta.cuenta_id}
                        onChange={(e) => setTransaccion({ ...transaccion, cuenta: { cuenta_id: e.target.value } })}
                        className="bg-white rounded-lg py-2 px-2 border border-gray-300">
                        <option value="">Seleccione una cuenta</option>
                        {cuentas.map((cuenta) => (
                            <option key={cuenta.cuenta_id} value={cuenta.cuenta_id}>
                                {cuenta.alias}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label className="block mb-2 text-sm font-medium">Moneda</label>
                    <select
                        name="moneda_id"
                        value={transaccion.moneda.moneda_id}
                        onChange={(e) => setTransaccion({ ...transaccion, moneda: { moneda_id: e.target.value } })}
                        className="bg-white rounded-lg py-2 px-2 border border-gray-300">
                        <option value="">Seleccione moneda</option>
                        <option value="1">ARG</option>
                        <option value="2">USD</option>
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
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                        Registrar Transacción
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-red-600 text-white mt-4 py-2 px-4 rounded">
                        Cancelar
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default NuevaTransac
