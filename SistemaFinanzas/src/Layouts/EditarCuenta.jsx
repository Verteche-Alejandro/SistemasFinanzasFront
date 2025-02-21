// EditarCuenta.jsx
import { useState } from "react";
import Modal from "../Components/Modals/Modal";
import FormCuenta from "./FormCuenta";
import { updateCuenta, getCuentasByUsuarioId } from "../Services/Controllers/Cuenta"

const EditarCuenta = ({ isOpen, onClose, cuenta, onActualizar }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleActualizar = async (cuentaData) => {
        setLoading(true);
        setError('');
        try {
            const response = await updateCuenta(cuenta.cuenta_id, {
                alias: cuentaData.alias,
                saldo: Number(cuentaData.saldo),
                tipoDeCuenta: cuentaData.tipoDeCuenta,
                moneda: {
                    moneda_id: Number(cuentaData.moneda.moneda_id)
                }
            });
            if (response) {
                setSuccess(true);
                await actualizarCuentasEnSession();

                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                }, 2000);
            }
        } catch (err) {
            setError(err.message || "Error al actualizar la cuenta");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const actualizarCuentasEnSession = async () => {
        const id = localStorage.getItem("usuario_id");
        const cuentasActualizadas = await getCuentasByUsuarioId(id);

        if (cuentasActualizadas) {
            const cuentasConSaldoNumerico = cuentasActualizadas.map(cuenta => ({
                ...cuenta,
                saldo: typeof cuenta.saldo === 'string' ? parseFloat(cuenta.saldo) : cuenta.saldo
            }));

            sessionStorage.setItem("cuentasUsuario", JSON.stringify(cuentasConSaldoNumerico));

            if (onActualizar) {
                const cuentaActualizada = cuentasConSaldoNumerico.find(c => c.cuenta_id === cuenta.cuenta_id);
                onActualizar(cuentaActualizada);
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Cuenta" width="w-96" className="mx-4">
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Cuenta actualizada exitosamete
                </div>
            )}
            <FormCuenta
                cuenta={cuenta}
                onSubmit={handleActualizar}
                onCancel={onClose}
                loading={loading}
                submitButtonText="Actualizar Cuenta"
                loadingButtonText="Actualizando..."
                isEditing={true}
            />
        </Modal>
    );
};
export default EditarCuenta