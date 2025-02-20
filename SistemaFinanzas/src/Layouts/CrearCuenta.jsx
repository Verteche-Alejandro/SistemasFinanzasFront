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
        setSuccess(false);
    };

    useEffect(() => {
        if (!isOpen) resetFormulario();
    }, [isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Limpiamos todos los errores relacionados
        setErrores(prevErrores => ({ ...prevErrores, [name]: "", api: "" }));

        setNewCuenta(prev => {
            // Validación del alias
            if (name === "alias") {
                // Verificar si el alias ya existe en las cuentas del usuario
                const cuentasUsuario = JSON.parse(sessionStorage.getItem("cuentasUsuario") || "[]");
                const aliasExistente = cuentasUsuario.some(cuenta =>
                    cuenta.alias.toLowerCase() === value.toLowerCase() &&
                    cuenta.cuenta_id !== newCuenta.cuenta_id
                );

                if (aliasExistente) {
                    setErrores(prevErrores => ({
                        ...prevErrores,
                        alias: "Ya tienes una cuenta con este nombre"
                    }));
                    return prev;
                }

                // Rechazar si contiene números
                if (/\d/.test(value)) {
                    setErrores(prevErrores => ({
                        ...prevErrores,
                        alias: "El alias no puede contener números"
                    }));
                    return prev;
                }

                // Permitir solo letras, espacios y algunos caracteres especiales
                if (value && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]*$/.test(value)) {
                    setErrores(prevErrores => ({
                        ...prevErrores,
                        alias: "El alias solo puede contener letras y espacios"
                    }));
                    return prev;
                }

                return { ...prev, alias: value };
            }

            // Validación del saldo
            if (name === "saldo") {
                // Permitir campo vacío para poder borrar
                if (value === '') {
                    return { ...prev, saldo: '' };
                }

                const saldoNumerico = parseFloat(value);
                if (isNaN(saldoNumerico)) {
                    setErrores(prevErrores => ({
                        ...prevErrores,
                        saldo: "El saldo debe ser un número válido"
                    }));
                    return prev;
                }

                if (saldoNumerico < 0) {
                    setErrores(prevErrores => ({
                        ...prevErrores,
                        saldo: "El saldo no puede ser negativo"
                    }));
                    return prev;
                }

                // Validar que no exceda un límite razonable
                if (saldoNumerico > 1000000000) {
                    setErrores(prevErrores => ({
                        ...prevErrores,
                        saldo: "El saldo no puede superar 1.000.000.000"
                    }));
                    return prev;
                }

                return { ...prev, saldo: value };
            }

            // Manejo de la selección de moneda
            if (name === "moneda_id") {
                return {
                    ...prev,
                    moneda: {
                        ...prev.moneda,
                        moneda_id: value
                    }
                };
            }

            // Manejo del tipo de cuenta
            if (name === "tipoDeCuenta") {
                // Verificar límite de cuentas por tipo
                const cuentasUsuario = JSON.parse(sessionStorage.getItem("cuentasUsuario") || "[]");
                const cuentasDelMismoTipo = cuentasUsuario.filter(cuenta =>
                    cuenta.tipoDeCuenta === value
                ).length;

                if (cuentasDelMismoTipo >= 2) {
                    setErrores(prevErrores => ({
                        ...prevErrores,
                        tipoDeCuenta: `Ya tienes el máximo de cuentas ${value.toLowerCase()} permitidas`
                    }));
                    return prev;
                }
            }

            return { ...prev, [name]: value };
        });
    };

    const validarFormulario = () => {
        let nuevosErrores = {};

        // Validación del alias
        if (!newCuenta.alias.trim()) {
            nuevosErrores.alias = "El alias de la cuenta es obligatorio";
        } else if (newCuenta.alias.length < 3) {
            nuevosErrores.alias = "El alias debe tener al menos 3 caracteres";
        } else if (newCuenta.alias.length > 30) {
            nuevosErrores.alias = "El alias no puede tener más de 30 caracteres";
        }

        // Validación del tipo de cuenta
        if (!newCuenta.tipoDeCuenta) {
            nuevosErrores.tipoDeCuenta = "Debe seleccionar un tipo de cuenta";
        }

        // Validación de la moneda
        if (!newCuenta.moneda.moneda_id) {
            nuevosErrores.moneda_id = "Debe seleccionar una moneda";
        }

        // Validación del saldo
        if (newCuenta.saldo === '' || newCuenta.saldo === '0') {
            nuevosErrores.saldo = "El saldo inicial debe ser mayor a 0";
        } else {
            const saldoNumerico = parseFloat(newCuenta.saldo);
            if (isNaN(saldoNumerico) || saldoNumerico <= 0) {
                nuevosErrores.saldo = "El saldo inicial debe ser mayor a 0";
            }
        }

        // Validar límite total de cuentas
        const cuentasUsuario = JSON.parse(sessionStorage.getItem("cuentasUsuario") || "[]");
        if (cuentasUsuario.length >= 2) {
            nuevosErrores.general = "Ya has alcanzado el límite máximo de 2 cuentas permitidas";
        }

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
                saldo: Number(newCuenta.saldo),
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

                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                }, 2000);
            }
        } catch (err) {
            setErrores({
                api: err.message || "Hubo un error al crear la cuenta"
            });
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
        <Modal isOpen={isOpen} onClose={onClose} title="Crear Nueva Cuenta" width="w-96" className="mx-4">
            <div className="space-y-4">
                {/* Mensajes de error y éxito */}
                {errores.api && (
                    <div className={`border px-4 py-3 rounded ${errores.api.includes("límite de cuentas")
                        ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                        : "bg-red-100 border-red-400 text-red-700"
                        }`}>
                        {errores.api}
                    </div>
                )}
                {errores.general && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                        {errores.general}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        Cuenta creada exitosamente
                    </div>
                )}

                {/* Formulario */}
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

                <div className="flex justify-end space-x-4 mt-4">
                    <ButtonForm
                        text="Cancelar"
                        className="bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white hover:border-white"
                        onClick={onClose}
                    />
                    <ButtonForm
                        text="Guardar Cuenta"
                        className="bg-white text-[#2da0ad] border-2 border-[#2da0ad] hover:bg-[#2da0ad] hover:text-white hover:border-white transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md"
                        onClick={handleGuardar}
                        disabled={loading || Object.keys(errores).length > 0}
                    >
                        {loading ? "Creando..." : "Guardar Cuenta"}
                    </ButtonForm>
                </div>
            </div>
        </Modal>
    );
};

export default CrearCuenta;
