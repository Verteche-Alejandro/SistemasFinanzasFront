import { useState, useEffect } from "react";
import Modal from "../Components/Modals/Modal";
import { createCuenta, getCuentasByUsuarioId } from "../Services/Controllers/Cuenta";
import InputForm from "../Components/Inputs/InputForm";
import ButtonForm from "../Components/Buttons/ButtonForm";

const CrearCuenta = ({ isOpen, onClose, onGuardarCuenta }) => {
    const estadoInicial = {
        alias: '',
        tipoDeCuenta: '',
        saldo: '',
        usuario: {
            usuario_id: localStorage.getItem("usuario_id") || ''
        },
        moneda: {
            moneda_id: ''
        }
    };

    const [newCuenta, setNewCuenta] = useState(estadoInicial);
    const [errores, setErrores] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const resetFormulario = () => {
        setNewCuenta(estadoInicial);
        setErrores({});
    };

    useEffect(() => {
        if (!isOpen) resetFormulario();
    }, [isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Limpiamos el error cuando el usuario empieza a escribir
        setErrores(prevErrores => ({ ...prevErrores, [name]: "" }));

        setNewCuenta(prev => {
            if (name === "saldo") {
                const saldoNumerico = parseFloat(value);
                if (isNaN(saldoNumerico) || saldoNumerico < 0) {
                    setErrores(prevErrores => ({ ...prevErrores, saldo: "El saldo debe ser un número válido y mayor o igual a 0" }));
                    return prev;
                }
                return { ...prev, saldo: saldoNumerico };
            }

            if (name === "moneda_id") {
                return {
                    ...prev,
                    moneda: {
                        ...prev.moneda,
                        moneda_id: value
                    }
                };
            }

            return { ...prev, [name]: value };
        });
    };



    const validarFormulario = () => {
        let nuevosErrores = {};
        if (!newCuenta.alias.trim()) nuevosErrores.alias = "El alias de la cuenta es obligatorio";
        if (!newCuenta.tipoDeCuenta) nuevosErrores.tipoDeCuenta = "Debe seleccionar un tipo de cuenta";
        if (!newCuenta.moneda.moneda_id) nuevosErrores.moneda_id = "Debe seleccionar una moneda";
        if (Number(newCuenta.saldo) <= 0) nuevosErrores.saldo = "El saldo inicial no puede ser negativo ni 0";
        return nuevosErrores;
    };

    const handleGuardar = async () => {
        setLoading(true);
        setErrores({});
        setSuccess(false);

        const nuevosErrores = validarFormulario();
        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            setLoading(false);
            return;
        }

        try {
            const cuentaData = {
                ...newCuenta,
                saldo: Number(newCuenta.saldo) || 0,
                usuario: {
                    usuario_id: Number(newCuenta.usuario.usuario_id)
                },
                moneda: {
                    moneda_id: Number(newCuenta.moneda.moneda_id)
                }
            };

            const response = await createCuenta(cuentaData);

            if (response?.message) {
                setSuccess(true);
                await actualizarCuentasEnSession();

                setNewCuenta(estadoInicial);

                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                }, 2000);
            } else {
                throw new Error("Error al crear la cuenta");
            }
        } catch (err) {
            setErrores({ api: err.message || "Hubo un error al crear la cuenta" });
        } finally {
            setLoading(false);
        }
    };

    const actualizarCuentasEnSession = async () => {
        try {
            const id = localStorage.getItem("usuario_id");
            const cuentasActualizadas = await getCuentasByUsuarioId(id);
            if (cuentasActualizadas) {
                const cuentasConSaldoNumerico = cuentasActualizadas.map(cuenta => ({
                    ...cuenta,
                    saldo: typeof cuenta.saldo === 'string' ? parseFloat(cuenta.saldo) : cuenta.saldo
                }));
                sessionStorage.setItem("cuentasUsuario", JSON.stringify(cuentasConSaldoNumerico));
                if (onGuardarCuenta) {
                    onGuardarCuenta(cuentasConSaldoNumerico[cuentasConSaldoNumerico.length - 1]);
                }
            }
        } catch (error) {
            setErrores({ api: "Hubo un problema al actualizar las cuentas" });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Crear Nueva Cuenta" width="max-w-md" className="mx-4">
            <div className="space-y-4">
                {errores.api && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errores.api}</div>}
                {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">Cuenta creada exitosamente</div>}

                <InputForm
                    label="Nombre de la cuenta"
                    type="text"
                    name="alias"
                    value={newCuenta.alias}
                    onChange={handleInputChange}
                    placeholder="Nombre de la cuenta"
                />
                {errores.alias && <p className="text-red-500 text-sm">{errores.alias}</p>}

                <label className="block text-gray-700 mb-2">Tipo de Cuenta</label>
                <select
                    name="tipoDeCuenta"
                    value={newCuenta.tipoDeCuenta}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Selecciona un tipo de cuenta</option>
                    <option value="Ahorro">Ahorro</option>
                    <option value="Corriente">Corriente</option>
                </select>
                {errores.tipoDeCuenta && <p className="text-red-500 text-sm">{errores.tipoDeCuenta}</p>}

                <label className="block text-gray-700 mb-2">Moneda</label>
                <select
                    name="moneda_id"
                    value={newCuenta.moneda.moneda_id}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Selecciona una moneda</option>
                    <option value="1">ARS</option>
                    <option value="2">USD</option>
                </select>
                {errores.moneda_id && <p className="text-red-500 text-sm">{errores.moneda_id}</p>}

                <InputForm
                    label="Saldo inicial"
                    type="number"
                    name="saldo"
                    value={newCuenta.saldo}
                    onChange={handleInputChange}
                    placeholder="Saldo inicial"
                    min="0"
                    step="0.01"
                />
                {errores.saldo && <p className="text-red-500 text-sm">{errores.saldo}</p>}

                <div className="flex justify-end gap-4 mt-6">
                    <ButtonForm text="Cancelar" onClick={onClose} className="button-editar" />
                    <ButtonForm text="Guardar Cuenta" onClick={handleGuardar} disabled={loading}>{loading ? "Creando..." : "Guardar Cuenta"}</ButtonForm>
                </div>
            </div>
        </Modal>
    );
};

export default CrearCuenta;
