// CrearCuenta.jsx
import { useState } from "react";
import Modal from "../Components/Modals/Modal";
import FormCuenta from "./FormCuenta";
import { createCuenta, getCuentasByUsuarioId } from "../Services/Controllers/Cuenta";

const CrearCuenta = ({ isOpen, onClose, onGuardarCuenta }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleGuardar = async (cuentaData) => {
        setLoading(true);
        try {
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
            console.error(err);
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
            console.error(error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Crear Nueva Cuenta" width="w-96" className="mx-4">
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    Cuenta creada correctamente
                </div>
            )}
            <FormCuenta
                onSubmit={handleGuardar}
                onCancel={onClose}
                loading={loading}
            />
        </Modal>
    );
};
export default CrearCuenta