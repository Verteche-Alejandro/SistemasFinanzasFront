import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Esquema from "../Layouts/Esquema";
import { getCuentasByUsuarioId } from "../Services/Controllers/Cuenta";
import CustomAlert from "../Components/CustomAlert";
import ModalAlerta from "../Layouts/ModalAlerta";

const Cuentas = () => {
    const [cuentas, setCuentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [montoAlarma, setMontoAlarma] = useState('');
    const [alertas, setAlertas] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [tempMontoAlarma, setTempMontoAlarma] = useState('');

    useEffect(() => {
        const cargarCuentas = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No hay token de autenticación");
                    setLoading(false);
                    return;
                }

                const decoded = jwtDecode(token);
                const usuarioId = decoded.usuario_id;

                let cuentasSession = sessionStorage.getItem("cuentasUsuario");
                let cuentasParseadas = cuentasSession ? JSON.parse(cuentasSession) : null;

                if (
                    !cuentasParseadas ||
                    !cuentasParseadas.length ||
                    cuentasParseadas[0]?.usuario_id !== usuarioId
                ) {
                    const response = await getCuentasByUsuarioId(usuarioId);

                    if (!response) {
                        throw new Error("No se pudieron obtener las cuentas");
                    }

                    sessionStorage.setItem(
                        "cuentasUsuario",
                        JSON.stringify(response)
                    );
                    setCuentas(response);
                } else {
                    setCuentas(cuentasParseadas);
                }

                const montoAlarmaSession = sessionStorage.getItem(`montoAlarma_${usuarioId}`);
                if (montoAlarmaSession) {
                    setMontoAlarma(montoAlarmaSession);
                }

            } catch (error) {
                console.error("Error:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        cargarCuentas();
    }, []);

    useEffect(() => {
        if (montoAlarma) {
            const cuentasEnAlarma = cuentas.filter(
                (cuenta) => cuenta.saldo < Number(montoAlarma)
            );
            setAlertas(cuentasEnAlarma);
            setShowNotification(cuentasEnAlarma.length > 0);
        } else {
            setAlertas([]);
            setShowNotification(false);
        }
    }, [cuentas, montoAlarma]);

    const handleTempMontoAlarmaChange = (e) => {
        const valor = e.target.value;
        if (valor === '' || (!isNaN(valor) && valor >= 0)) {
            setTempMontoAlarma(valor);
        }
    };

    const handleGuardarAlarma = () => {
        if (tempMontoAlarma) {
            const token = localStorage.getItem("token");
            const decoded = jwtDecode(token);
            const usuarioId = decoded.usuario_id;

            sessionStorage.setItem(`montoAlarma_${usuarioId}`, tempMontoAlarma);
            setMontoAlarma(tempMontoAlarma);
            setShowModal(false);
        }
    };

    if (loading) {
        return (
            <Esquema>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </Esquema>
        );
    }

    if (error) {
        return (
            <Esquema>
                <div className="flex justify-center items-center h-screen">
                    <CustomAlert title="Error" messages={error} />
                </div>
            </Esquema>
        );
    }

    return (
        <Esquema>
            <div className="flex flex-col p-6 justify-center">
                <div className="flex justify-center items-center mb-8">
                    <h1 className="text-4xl font-semibold text-gray-800">
                        Mis Cuentas
                    </h1>
                </div>

                {/* Botón para mostrar modal */}
                <div className="mb-6 max-w-md mx-auto w-full">
                    <button
                        onClick={() => {
                            setTempMontoAlarma(montoAlarma);
                            setShowModal(true);
                        }}
                        className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                        {montoAlarma ? 'Modificar Alerta (Actual: $' + Number(montoAlarma).toLocaleString("es-ES") + ')' : 'Establecer Alerta de Saldo'}
                    </button>
                </div>

                <ModalAlerta
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onGuardar={handleGuardarAlarma}
                    montoAlarma={tempMontoAlarma}
                    onChange={handleTempMontoAlarmaChange}
                />

                {/* Alertas */}
                {showNotification && (
                    <CustomAlert
                        title="¡Atención! Cuentas con saldo bajo"
                        messages={alertas.map(cuenta =>
                            `La cuenta ${cuenta.alias} tiene un saldo de $${cuenta.saldo.toLocaleString("es-ES")}, por debajo del límite establecido ($${Number(montoAlarma).toLocaleString("es-ES")})`
                        )}
                        onClose={() => setShowNotification(false)}
                    />
                )}

                {/* Grid de cuentas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {cuentas.map((cuenta) => (
                        <div
                            key={cuenta.cuenta_id}
                            className={`bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between h-full transform transition-all duration-300 hover:scale-105 ${montoAlarma && cuenta.saldo < Number(montoAlarma)
                                ? 'border-2 border-red-500'
                                : ''
                                }`}
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                {cuenta.alias}
                            </h2>
                            <div className="flex-grow items-center justify-center">
                                <p className="text-gray-600 mb-2">
                                    Tipo de Cuenta: {cuenta.tipoDeCuenta}
                                </p>
                                <p className="text-gray-600 mb-2">
                                    Moneda: {cuenta.moneda?.nombre}
                                </p>
                                <p className={`mt-4 text-3xl font-bold text-center ${montoAlarma && cuenta.saldo < Number(montoAlarma)
                                    ? 'text-red-600'
                                    : 'text-green-600'
                                    }`}>
                                    ${cuenta.saldo.toLocaleString("es-ES")}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 w-full sm:w-auto">
                                    Editar
                                </button>
                                <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 w-full sm:w-auto">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Esquema>
    )
}
export default Cuentas
