import { useState } from "react";
import Modal from "../Components/Modals/Modal";
import { createCuenta } from "../Services/Controllers/Cuenta"; // Asegúrate de que la ruta sea correcta

const CrearCuenta = ({ isOpen, onClose, onGuardarCuenta }) => {
    const [newCuenta, setNewCuenta] = useState({
        alias: '',
        tipoDeCuenta: '',
        moneda: '',
        saldo: 0
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Función para manejar los cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCuenta({ ...newCuenta, [name]: value });
    };

    // Función para manejar el envío del formulario
    const handleGuardar = async () => {
        setLoading(true);
        setError('');
        setSuccess(false);

        // Validación de los campos
        if (!newCuenta.alias || !newCuenta.tipoDeCuenta || !newCuenta.moneda || newCuenta.saldo <= 0) {
            setError("Todos los campos son obligatorios y el saldo debe ser mayor que 0.");
            setLoading(false);
            return;
        }

        // Crear el objeto con los datos del formulario
        const cuentaData = {
            alias: newCuenta.alias,
            tipoDeCuenta: newCuenta.tipoDeCuenta,
            moneda: newCuenta.moneda,
            saldoInicial: parseFloat(newCuenta.saldo),
        };

        // Llama al servicio para crear la cuenta
        const respuesta = await createCuenta(cuentaData);

        if (respuesta?.success) {
            setSuccess(true);
            onGuardarCuenta(cuentaData);  // Llama la función que pasa el componente principal
            setTimeout(() => {
                onClose();  // Cerrar el modal después de 2 segundos
            }, 2000);
        } else {
            setError("Hubo un error al crear la cuenta. Intenta nuevamente.");
        }

        setLoading(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold mb-4">Crear Nueva Cuenta</h2>

            {/* Mostrar mensaje de error o éxito */}
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">Cuenta creada exitosamente.</div>}

            <div className="mb-4">
                <label className="block text-gray-700">Nombre de la Cuenta</label>
                <input
                    type="text"
                    name="alias"
                    value={newCuenta.alias}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    placeholder="Nombre de la cuenta"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Tipo de Cuenta</label>
                <select
                    name="tipoDeCuenta"
                    value={newCuenta.tipoDeCuenta}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded"
                >
                    <option value="">Selecciona un tipo de cuenta</option>
                    <option value="Ahorro">Ahorro</option>
                    <option value="Corriente">Corriente</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Moneda</label>
                <select
                    name="moneda"
                    value={newCuenta.moneda}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded"
                >
                    <option value="">Selecciona una moneda</option>
                    <option value="ARS">ARS</option>
                    <option value="USD">USD</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Saldo Inicial</label>
                <input
                    type="number"
                    name="saldo"
                    value={newCuenta.saldo}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    placeholder="Saldo inicial"
                />
            </div>

            <div className="flex justify-end gap-4">
                <button
                    onClick={onClose}
                    className="bg-gray-400 text-white px-6 py-3 rounded-lg"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleGuardar}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg"
                    disabled={loading}
                >
                    {loading ? "Cargando..." : "Guardar Cuenta"}
                </button>
            </div>
        </Modal>
    );
};

export default CrearCuenta;
