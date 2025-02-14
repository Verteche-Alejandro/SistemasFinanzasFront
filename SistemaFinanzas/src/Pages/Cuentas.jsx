import { useState, useEffect } from "react";
import Esquema from "../Layouts/Esquema";
import { getCuentasByUsuarioId } from "../Services/Controllers/Cuenta";
import CustomAlert from "../Components/CustomAlert";
import ModalAlerta from "../Layouts/ModalAlerta";
import CrearCuenta from "../Layouts/CrearCuenta"; // Asegúrate de tener el componente CrearCuenta importado

const Cuentas = () => {
    const [cuentas, setCuentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [montoAlarma, setMontoAlarma] = useState('');
    const [alertas, setAlertas] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [tempMontoAlarma, setTempMontoAlarma] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false); // Nuevo estado para el modal de CrearCuenta

    useEffect(() => {
        const cargarCuentas = async () => {
            try {
                const id = localStorage.getItem("usuario_id");
                if (!id) {
                    setError("No se encontró el id del usuario");
                    setLoading(false);
                    return;
                }

                let cuentasSession = sessionStorage.getItem("cuentasUsuario");
                let cuentasParseadas = cuentasSession ? JSON.parse(cuentasSession) : null;

                if (!cuentasParseadas || !cuentasParseadas.length || cuentasParseadas[0]?.usuario_id !== id) {
                    const response = await getCuentasByUsuarioId(id);
                    // Aquí está faltando guardar las cuentas
                    if (!response) {
                        throw new Error("No se pudieron obtener las cuentas");
                    }

                    // Convertir saldos a números
                    const cuentasConSaldoNumerico = response.map(cuenta => ({
                        ...cuenta,
                        saldo: typeof cuenta.saldo === 'string' ? parseFloat(cuenta.saldo) : cuenta.saldo
                    }));

                    // Guardar en sessionStorage
                    sessionStorage.setItem("cuentasUsuario", JSON.stringify(cuentasConSaldoNumerico));

                    // Actualizar el estado
                    setCuentas(cuentasConSaldoNumerico);
                }

                const montoAlarmaSession = sessionStorage.getItem(`montoAlarma_${id}`);
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
            const id = localStorage.getItem("usuario_id");
            sessionStorage.setItem(`montoAlarma_${id}`, tempMontoAlarma);
            setMontoAlarma(tempMontoAlarma);
            setShowModal(false);
        }
    };

    const handleGuardarCuenta = (nuevaCuenta) => {
        // Asegurarnos de que el saldo sea número
        const cuentaConSaldoNumerico = {
            ...nuevaCuenta,
            saldo: typeof nuevaCuenta.saldo === 'string' ? parseFloat(nuevaCuenta.saldo) : nuevaCuenta.saldo
        };

        setCuentas(prevCuentas => {
            const cuentasActualizadas = [...prevCuentas, cuentaConSaldoNumerico];
            // Guardar en sessionStorage dentro del callback de setCuentas
            sessionStorage.setItem("cuentasUsuario", JSON.stringify(cuentasActualizadas));
            return cuentasActualizadas;
        });
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

    function formatearNumero(num) {
        const numero = parseFloat(num);
        if (isNaN(numero)) return '0.00';
        return numero.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    return (
        <Esquema>
            <div className="flex flex-col p-6 justify-center">
                <div className="flex justify-center items-center mb-8">
                    <h1 className="text-4xl font-semibold text-gray-800">
                        Mis Cuentas
                    </h1>
                </div>

                {/* Botón para mostrar el modal de establecer alerta de saldo */}
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

                {/* Botón para abrir el modal de crear cuenta */}
                <div className="mb-6 max-w-md mx-auto w-full">
                    <button
                        onClick={() => setShowCreateModal(true)} // Abre el modal de Crear Cuenta
                        className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Crear Nueva Cuenta
                    </button>
                </div>

                <CrearCuenta
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onGuardarCuenta={handleGuardarCuenta}
                />

                <ModalAlerta isOpen={showModal} onClose={() => setShowModal(false)} onGuardar={handleGuardarAlarma} montoAlarma={tempMontoAlarma} onChange={handleTempMontoAlarmaChange} />

                {/* Alertas */}
                {showNotification && (
                    <CustomAlert
                        title="¡Atención! Cuentas con saldo bajo"
                        messages={alertas.map(cuenta =>
                            `La cuenta ${cuenta.alias} tiene un saldo de $${Number(cuenta.saldo).toLocaleString("es-ES")}, por debajo del límite establecido ($${Number(montoAlarma).toLocaleString("es-ES")})`
                        )}
                        onClose={() => setShowNotification(false)}
                    />
                )}

                {/* Grid de cuentas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {cuentas.map((cuenta) => (
                        <div key={cuenta.cuenta_id} className={`card ${montoAlarma && Number(cuenta.saldo) < Number(montoAlarma) ? 'border-2 border-red-500' : ''}`}>
                            <div className="mb-5">
                                <h1 className="card-title">
                                    Nombre de Cuenta
                                </h1>
                                <p>
                                    {cuenta.alias}
                                </p>
                            </div>
                            <div className="flex flex-col items-center justify-start gap-4">
                                <div>
                                    <h3 className="font-bold">Tipo de Cuenta</h3>
                                    <p>{cuenta.tipoDeCuenta}</p>
                                </div>
                                <div>
                                    <h3 className="font-bold">Moneda</h3>
                                    <p>
                                        {cuenta.moneda?.nombre}
                                    </p>
                                </div>
                                <div className={`m-10 text-3xl text-center ${montoAlarma && Number(cuenta.saldo) < Number(montoAlarma) ? 'text-red-400' : 'text-green-300'}`}>
                                    <h3 className="font-bold">Saldo:</h3>
                                    <p>
                                        ${formatearNumero(cuenta.saldo)}
                                    </p>
                                </div>

                            </div>
                            <div className="buttons flex flex-wrap items-center justify-center gap-4 mt-4">
                                <button className="button-editar">
                                    Editar
                                </button>
                                <button className="button-editar">
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

export default Cuentas;
