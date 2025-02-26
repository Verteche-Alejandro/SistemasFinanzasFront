import { useState, useEffect } from "react";
import InputForm from "../Components/Inputs/InputForm";
import ButtonForm from "../Components/Buttons/ButtonForm";
import SelectForm from "../Components/Inputs/SelectForm";

const FormCuenta = ({ cuenta, onSubmit, onCancel, loading, submitButtonText = "Guardar Cuenta", loadingButtonText = "Guardando...", isEditing = false }) => {
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

    const [formData, setFormData] = useState(estadoInicial);
    const [errores, setErrores] = useState({});

    useEffect(() => {
        if (cuenta) {
            setFormData({
                ...cuenta,
                saldo: cuenta.saldo.toString(),
                moneda: {
                    moneda_id: cuenta.moneda.moneda_id.toString()
                }
            });
        }
    }, [cuenta]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setErrores(prevErrores => ({ ...prevErrores, [name]: "", api: "" }));

        setFormData(prev => {
            if (name === "alias") {
                const cuentasUsuario = JSON.parse(sessionStorage.getItem("cuentasUsuario") || "[]");
                const aliasExistente = cuentasUsuario.some(c =>
                    c.alias.toLowerCase() === value.toLowerCase() &&
                    c.cuenta_id !== cuenta?.cuenta_id
                );

                if (aliasExistente) {
                    setErrores(prevErrores => ({
                        ...prevErrores,
                        alias: "Ya tienes una cuenta con este nombre"
                    }));
                    return prev;
                }

                if (/\d/.test(value)) {
                    setErrores(prevErrores => ({
                        ...prevErrores,
                        alias: "El alias no puede contener números"
                    }));
                    return prev;
                }

                if (value && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]*$/.test(value)) {
                    setErrores(prevErrores => ({
                        ...prevErrores,
                        alias: "El alias solo puede contener letras y espacios"
                    }));
                    return prev;
                }

                return { ...prev, alias: value };
            }

            if (name === "saldo") {
                console.log("Saldo ingresado:", value);

                if (value === '') return { ...prev, saldo: '' };

                const saldoNumerico = parseFloat(value);
                if (isNaN(saldoNumerico)) {
                    console.log("Error: El saldo no es un número válido");
                    return { ...prev, saldo: value };
                }

                if (saldoNumerico < 5000) {
                    console.log("Error: El saldo es menor a 5000");
                    setErrores(prevErrores => ({
                        ...prevErrores,
                        saldo: "El saldo no puede ser menor a 5.000"
                    }));
                } else if (saldoNumerico > 1000000000) {
                    console.log("Error: El saldo supera el límite de 10.000.000");
                    setErrores(prevErrores => ({
                        ...prevErrores,
                        saldo: "El saldo no puede superar 10.000.000"
                    }));
                }

                return { ...prev, saldo: value };
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

            if (name === "tipoDeCuenta" && !cuenta) {
                const cuentasUsuario = JSON.parse(sessionStorage.getItem("cuentasUsuario") || "[]");
                const cuentasDelMismoTipo = cuentasUsuario.filter(c =>
                    c.tipoDeCuenta === value
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

        if (!formData.alias.trim()) {
            nuevosErrores.alias = "El alias de la cuenta es obligatorio";
        } else if (formData.alias.length < 3) {
            nuevosErrores.alias = "El alias debe tener al menos 3 caracteres";
        } else if (formData.alias.length > 30) {
            nuevosErrores.alias = "El alias no puede tener más de 30 caracteres";
        }

        if (!formData.tipoDeCuenta) {
            nuevosErrores.tipoDeCuenta = "Debe seleccionar un tipo de cuenta";
        }

        if (!formData.moneda.moneda_id) {
            nuevosErrores.moneda_id = "Debe seleccionar una moneda";
        }

        const saldoNumerico = parseFloat(formData.saldo);
        if (isNaN(saldoNumerico) || saldoNumerico < 5000) {
            nuevosErrores.saldo = "El saldo debe ser mayor o igual a 5.000";
        }

        if (!cuenta) {
            const cuentasUsuario = JSON.parse(sessionStorage.getItem("cuentasUsuario") || "[]");
            if (cuentasUsuario.length >= 2) {
                nuevosErrores.general = "Ya has alcanzado el límite máximo de 2 cuentas permitidas";
            }
        }

        return nuevosErrores;
    };

    const handleSubmit = async () => {
        const nuevosErrores = validarFormulario();
        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        const cuentaData = {
            ...formData,
            saldo: Number(formData.saldo),
            usuario: {
                usuario_id: Number(formData.usuario.usuario_id)
            },
            moneda: {
                moneda_id: Number(formData.moneda.moneda_id)
            }
        };
        try {
            await onSubmit(cuentaData);
        } catch (error) {
            setErrores(prevErrores => ({ ...prevErrores, api: "Error al guardar la cuenta" }));
        }
    };

    return (
        <div className="space-y-4">
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

            <InputForm
                label="Nombre de la cuenta"
                type="text"
                name="alias"
                value={formData.alias}
                onChange={handleInputChange}
                placeholder="Nombre de la cuenta"
            />
            {errores.alias && <p className="text-red-500 text-sm">{errores.alias}</p>}

            <div className="flex flex-col m-5">
                <SelectForm
                    label="Tipo de cuenta"
                    titleOption={"Selecione un tipo"}
                    name="tipoDeCuenta"
                    value={formData.tipoDeCuenta}
                    onChange={handleInputChange}
                    disabled={isEditing ? false : !!cuenta}
                    options={["Ahorro", "Corriente"]}
                />
                {errores.tipoDeCuenta && <p className="text-red-500 text-sm">{errores.tipoDeCuenta}</p>}

                <SelectForm
                    label="Moneda"
                    titleOption={"Seleccione una moneda"}
                    name="moneda_id"
                    value={formData.moneda.moneda_id}
                    onChange={handleInputChange}
                    disabled={isEditing ? false : !!cuenta}
                    options={[
                        { value: "1", label: "ARS" },
                        { value: "2", label: "USD" }
                    ]}
                />
                {errores.moneda_id && <p className="text-red-500 text-sm">{errores.moneda_id}</p>}
            </div>

            <InputForm
                label="Saldo inicial"
                type="number"
                name="saldo"
                value={formData.saldo}
                onChange={handleInputChange}
                placeholder="Saldo inicial"
                disabled={!isEditing && !!cuenta} 
                min="5000" 
                step="0.01"
            />
            {errores.saldo && <p className="text-red-500 text-sm">{errores.saldo}</p>}
            <p className="text-gray-500 text-xs mt-1">El saldo mínimo es de $5.000</p>

            <div className="flex justify-end space-x-4 mt-4">
                <ButtonForm
                    text="Cancelar"
                    className="bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white hover:border-white"
                    onClick={onCancel}
                />
                <ButtonForm
                    text={loading ? loadingButtonText : submitButtonText}
                    className="bg-white text-[#2da0ad] border-2 border-[#2da0ad] hover:bg-[#2da0ad] hover:text-white hover:border-white transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    onClick={handleSubmit}
                    disabled={loading || Object.keys(errores).length > 0}
                />
            </div>
        </div>
    );
};
export default FormCuenta