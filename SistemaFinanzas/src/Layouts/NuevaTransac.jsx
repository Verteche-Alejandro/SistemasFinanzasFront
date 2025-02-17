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

        // Validación de monto
        if (!transaccion.monto) {
            nuevosErrores.monto = "El monto es obligatorio";
        } else {
            const montoNumerico = Number(transaccion.monto);
            if (montoNumerico <= 0) {
                nuevosErrores.monto = "El monto debe ser mayor a 0";
            }
            if (montoNumerico > 1000000) {
                nuevosErrores.monto = "El monto no puede superar 1,000,000";
            }
            if (!Number.isInteger(montoNumerico * 100)) {
                nuevosErrores.monto = "El monto no puede tener más de 2 decimales";
            }
        }

        // Validación de tipo de transacción
        if (!transaccion.tipo_transaccion) {
            nuevosErrores.tipo_transaccion = "Debe seleccionar un tipo de transacción";
        }

        // Validación de cuenta
        if (!transaccion.cuenta.cuenta_id) {
            nuevosErrores.cuenta_id = "Debe seleccionar una cuenta";
        } else {
            const cuentaSeleccionada = cuentas.find(c => c.cuenta_id === Number(transaccion.cuenta.cuenta_id));

            // Validación de saldo suficiente para retiros/pagos/transferencias
            if (cuentaSeleccionada &&
                ["RETIRO", "PAGO", "TRANSFERENCIA"].includes(transaccion.tipo_transaccion)) {
                if (Number(transaccion.monto) > cuentaSeleccionada.saldo) {
                    nuevosErrores.monto = "Saldo insuficiente en la cuenta";
                }
            }
        }

        // Validación de fecha
        const fechaTransaccion = new Date(transaccion.fecha);
        const fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0);

        if (fechaTransaccion > fechaActual) {
            nuevosErrores.fecha = "No se pueden registrar transacciones con fecha futura";
        }

        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - 30);
        if (fechaTransaccion < fechaLimite) {
            nuevosErrores.fecha = "No se pueden registrar transacciones con más de 30 días de antigüedad";
        }

        return nuevosErrores;
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

    const handleMontoChange = (e) => {
        const valor = e.target.value;
        // Solo permite números y un punto decimal
        if (valor === "" || /^\d*\.?\d{0,2}$/.test(valor)) {
            setTransaccion({ ...transaccion, monto: valor });
            setErrores(prev => ({ ...prev, monto: "" }));
        }
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

    function formatearNumero(num) {
        const numero = parseFloat(num);
        if (isNaN(numero)) return '0.00';
        return numero.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

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
                    onChange={handleMontoChange}
                    placeHolder="Ingrese el monto"
                    min="0.01"
                    step="0.01"
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
                                {cuenta.alias} - (Saldo: {formatearNumero(cuenta.saldo)})
                            </option>
                        ))}
                    </select>
                    {errores.cuenta_id && <p className="text-red-500 text-sm">{errores.cuenta_id}</p>}
                </div>

                <div className="form-group relative">
                    <InputForm
                        label="Moneda de la cuenta"
                        type="text"
                        readOnly={true}
                        value={transaccion.cuenta.cuenta_id ?
                            `$ ${cuentas.find(c => c.cuenta_id === Number(transaccion.cuenta.cuenta_id))?.moneda.nombre}` :
                            ""}
                    />
                </div>

                <InputForm
                    label="Fecha"
                    type="date"
                    name="fecha"
                    value={transaccion.fecha}
                    onChange={(e) => {
                        setTransaccion({ ...transaccion, fecha: e.target.value });
                        setErrores(prev => ({ ...prev, fecha: "" }));
                    }}
                    max={new Date().toISOString().slice(0, 10)}
                />
                {errores.fecha && <p className="text-red-500 text-sm">{errores.fecha}</p>}

                <div className="flex justify-between space-x-4">
                    <ButtonForm
                        text="Cancelar"
                        type="button"
                        onClick={onClose}
                        className="button-cancelar"
                    />
                    <ButtonForm
                        text="Registrar Transacción"
                        type="button"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default NuevaTransac;