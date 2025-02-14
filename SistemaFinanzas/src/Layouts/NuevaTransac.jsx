import { useEffect, useState } from "react";
import Modal from "../Components/Modals/Modal";
import InputForm from "../Components/Inputs/InputForm";
import { registrarTransaccion } from "../Services/Controllers/Transaccion";
import ButtonForm from "../Components/Buttons/ButtonForm";

const NuevaTransac = ({ isOpen, onClose, cuentas, onActualizarCuentas }) => {
    const estadoInicial = {
        monto: "",
        tipo_transaccion: "",
        fecha: new Date().toISOString().slice(0, 10),
        cuenta: { cuenta_id: "" },
        moneda: { moneda_id: "" }
    };

    const [transaccion, setTransaccion] = useState(estadoInicial);
    const [errores, setErrores] = useState({});
    const [success, setSuccess] = useState(false);

    const resetFormulario = () => {
        setTransaccion(estadoInicial);
        setErrores({});
    };

    useEffect(() => {
        if (!isOpen) resetFormulario();
    }, [isOpen]);

    const validarFormulario = () => {
        let nuevosErrores = {};
        if (!transaccion.monto) nuevosErrores.monto = "El monto es obligatorio";
        if (!transaccion.tipo_transaccion) nuevosErrores.tipo_transaccion = "Debe seleccionar un tipo de transacción";
        if (!transaccion.cuenta.cuenta_id) nuevosErrores.cuenta_id = "Debe seleccionar una cuenta";
        return nuevosErrores;
    };

    const Registrar = async (e) => {
        e.preventDefault();
        setSuccess(false);
        const nuevosErrores = validarFormulario();
        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        try {
            const datosTransaccion = {
                ...transaccion,
                monto: Number(transaccion.monto),
                cuenta: { cuenta_id: Number(transaccion.cuenta.cuenta_id) },
                moneda: { moneda_id: Number(transaccion.moneda.moneda_id) }
            };

            console.log("Datos enviados:", datosTransaccion);
            let rsp = await registrarTransaccion(datosTransaccion);

            if (rsp) {
                console.log("Respuesta del servidor:", rsp);
                setSuccess(true);
                onActualizarCuentas();
                resetFormulario();

                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                }, 2000);
            }
        } catch (error) {
            console.error("Error al registrar la transacción:", error);
            setErrores({ api: error.message || "Hubo un error al registrar la transacción" });
        }
    };

    const handleCuentaChange = (e) => {
        const cuentaId = e.target.value;
        const cuentaSeleccionada = cuentas.find(c => c.cuenta_id === Number(cuentaId));

        setTransaccion({
            ...transaccion,
            cuenta: { cuenta_id: cuentaId },
            moneda: { moneda_id: cuentaSeleccionada ? cuentaSeleccionada.moneda.moneda_id : "" }
        });
        setErrores(prev => ({ ...prev, cuenta_id: "" }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nueva Transacción">
            <form onSubmit={Registrar} className="space-y-4">
                {errores.api && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errores.api}</div>}
                {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">Transaccion registrada exitosamente</div>}
                <InputForm
                    label="Monto"
                    type="number"
                    name="monto"
                    value={transaccion.monto}
                    onChange={(e) => {
                        setTransaccion({ ...transaccion, monto: e.target.value });
                        setErrores(prev => ({ ...prev, monto: "" }));
                    }}
                    placeHolder="Ingrese el monto"
                />
                {errores.monto && <p className="text-red-500 text-sm">{errores.monto}</p>}

                <div className="form-group">
                    <label className="block mb-2 text-sm font-medium">Tipo de Transacción</label>
                    <select
                        name="tipo_transaccion"
                        value={transaccion.tipo_transaccion}
                        onChange={(e) => {
                            setTransaccion({ ...transaccion, tipo_transaccion: e.target.value });
                            setErrores(prev => ({ ...prev, tipo_transaccion: "" }));
                        }}
                        className="bg-white rounded-lg py-2 px-2 border border-gray-300"
                    >
                        <option value="" disabled>Seleccione tipo</option>
                        <option value="DEPOSITO">DEPOSITO</option>
                        <option value="RETIRO">RETIRO</option>
                        <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                        <option value="PAGO">PAGO</option>
                    </select>
                    {errores.tipo_transaccion && <p className="text-red-500 text-sm">{errores.tipo_transaccion}</p>}
                </div>

                <div className="form-group">
                    <label className="block mb-2 text-sm font-medium">Cuenta</label>
                    <select
                        name="cuenta_id"
                        value={transaccion.cuenta.cuenta_id}
                        onChange={handleCuentaChange}
                        className="bg-white rounded-lg py-2 px-2 border border-gray-300"
                    >
                        <option value="">Seleccione una cuenta</option>
                        {cuentas.map((cuenta) => (
                            <option key={cuenta.cuenta_id} value={cuenta.cuenta_id}>
                                {cuenta.alias} - {cuenta.moneda.nombre}
                            </option>
                        ))}
                    </select>
                    {errores.cuenta_id && <p className="text-red-500 text-sm">{errores.cuenta_id}</p>}
                </div>

                <div className="form-group">
                    <InputForm
                        label="Moneda de la cuenta"
                        type="text"
                        readOnly={true}
                        value={transaccion.cuenta.cuenta_id ? cuentas.find(c => c.cuenta_id === Number(transaccion.cuenta.cuenta_id))?.moneda.nombre : ""}
                    />
                </div>

                <InputForm
                    label="Fecha"
                    type="date"
                    name="fecha"
                    value={transaccion.fecha}
                    onChange={(e) => setTransaccion({ ...transaccion, fecha: e.target.value })}
                />

                <div className="flex justify-between space-x-4">
                    <ButtonForm
                        text="Cancelar"
                        type="button"
                        onClick={onClose}
                        className="button-editar"
                    />
                    <ButtonForm
                        text="Registrar Transacción"
                        type="submit"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default NuevaTransac;
