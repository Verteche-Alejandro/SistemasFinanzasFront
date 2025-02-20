import { useState, useEffect } from "react";
import Esquema from "../Layouts/Esquema";
import { getCuentasByUsuarioId } from "../Services/Controllers/Cuenta";
import CustomAlert from "../Components/CustomAlert";
import ModalAlerta from "../Layouts/ModalAlerta";
import CrearCuenta from "../Layouts/CrearCuenta";
import EditarCuenta from "../Layouts/EditarCuenta";
import { deleteCuenta } from "../Services/Controllers/Cuenta";
import ButtonForm from "../Components/Buttons/ButtonForm";
import PlusIcon from "../Assets/Icons/PlusIcon";
import Bell from "../Assets/Icons/Bell"
import DeleteCuenta from "../Layouts/DeleteCuenta";

const Cuentas = () => {
    const [cuentas, setCuentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [montoAlarma, setMontoAlarma] = useState('');
    const [alertas, setAlertas] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [tempMontoAlarma, setTempMontoAlarma] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [erroresAlarma, setErroresAlarma] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [cuentaEliminar, setCuentaEliminar] = useState(null);
    const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null);

    const handleEditarClick = (cuenta) => {
        setCuentaSeleccionada(cuenta);
        setShowEditModal(true);
    };

    const handleDeleteClick = (cuenta) => {
        setCuentaEliminar(cuenta);
        setShowDeleteModal(true);
    };

    const handleActualizarCuenta = (cuentaActualizada) => {
        setCuentas(prevCuentas => {
            const cuentasActualizadas = prevCuentas.map(cuenta =>
                cuenta.cuenta_id === cuentaActualizada.cuenta_id ? cuentaActualizada : cuenta
            );
            sessionStorage.setItem("cuentasUsuario", JSON.stringify(cuentasActualizadas));
            return cuentasActualizadas;
        });
    };

    // Modificar la función eliminarCuenta para incluir el ID
    const eliminarCuenta = async (id) => {
        try {
            const response = await deleteCuenta(id);
            if (!response) {
                throw new Error("No se pudo eliminar la cuenta");
            }

            setCuentas((prevCuentas) => {
                const cuentasActualizadas = prevCuentas.filter((cuenta) => cuenta.cuenta_id !== id);
                sessionStorage.setItem("cuentasUsuario", JSON.stringify(cuentasActualizadas));
                return cuentasActualizadas;
            });
        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
        }
    };

    const handleConfirmarDelete = async () => {
        if (cuentaEliminar) {
            await eliminarCuenta(cuentaEliminar.cuenta_id);
            setShowDeleteModal(false);
            setAccountToDelete(null);
        }
    };

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
                    if (!response) {
                        throw new Error("No se pudieron obtener las cuentas");
                    }

                    const cuentasConSaldoNumerico = response.map(cuenta => ({
                        ...cuenta,
                        saldo: typeof cuenta.saldo === 'string' ? parseFloat(cuenta.saldo) : cuenta.saldo
                    }));

                    sessionStorage.setItem("cuentasUsuario", JSON.stringify(cuentasConSaldoNumerico));
                    setCuentas(cuentasConSaldoNumerico);
                } else {
                    setCuentas(cuentasParseadas);
                }

                const montoAlarmaSession = sessionStorage.getItem(`montoAlarma_${id}`);
                if (montoAlarmaSession) {
                    setMontoAlarma(montoAlarmaSession);
                    setTempMontoAlarma(montoAlarmaSession);
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

    const validarMontoAlarma = (monto) => {
        if (!monto || monto.trim() === '') {
            setErroresAlarma("El monto es obligatorio");
            return false;
        }

        const montoNumerico = Number(monto);
        if (isNaN(montoNumerico)) {
            setErroresAlarma("El monto debe ser un número válido");
            return false;
        }

        if (montoNumerico <= 0) {
            setErroresAlarma("El monto debe ser mayor a 0");
            return false;
        }

        if (montoNumerico > 1000000000) {
            setErroresAlarma("El monto no puede ser mayor a 1.000.000.000");
            return false;
        }

        setErroresAlarma('');
        return true;
    };

    const handleTempMontoAlarmaChange = (e) => {
        const valor = e.target.value;
        setTempMontoAlarma(valor);

        // Limpiar error al cambiar el valor
        if (erroresAlarma) {
            setErroresAlarma('');
        }
    };

    const handleGuardarAlarma = () => {
        if (!validarMontoAlarma(tempMontoAlarma)) {
            return;
        }

        const id = localStorage.getItem("usuario_id");
        sessionStorage.setItem(`montoAlarma_${id}`, tempMontoAlarma);
        setMontoAlarma(tempMontoAlarma);
        setShowModal(false);
        setErroresAlarma('');
    };

    const handleGuardarCuenta = (nuevaCuenta) => {
        setCuentas(prevCuentas => {
            const cuentasActualizadas = [...prevCuentas, nuevaCuenta];
            sessionStorage.setItem("cuentasUsuario", JSON.stringify(cuentasActualizadas));
            return cuentasActualizadas;
        });
    };

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

    if (loading) {
        return (
            <Esquema>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
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
            {/* Contenedor principal con h-screen y overflow-auto */}
            <div className="h-screen overflow-auto">
                <div className="flex flex-col p-6 justify-center">
                    <div className="flex justify-center items-center mb-8">
                        <h1 className="bg-gradient-to-r from-[#49bdc7] to-[#83d7dd] text-transparent bg-clip-text text-4xl">
                            Mis Cuentas
                        </h1>
                    </div>

                    <div className="mb-6 max-w-md mx-auto w-full">
                        <ButtonForm
                            text={montoAlarma ? 'Modificar Alerta (Actual: $' + Number(montoAlarma).toLocaleString("es-ES") + ')' : 'Establecer Alerta de Saldo'}
                            onClick={() => setShowModal(true)}
                            className="w-full bg-white text-[#2da0ad] border-2 border-[#2da0ad] px-6 py-3 rounded-lg hover:bg-[#b5e8ec] active:bg-[#83d7dd] transition-all duration-300 flex items-center justify-center gap-2"
                            icono={<Bell />}>
                        </ButtonForm>


                    </div>

                    <div className="mb-6 max-w-md mx-auto">
                        <button
                            text="Nueva Cuenta"
                            onClick={() => setShowCreateModal(true)}
                            className="flex text-white items-center rounded-lg p-2 max-w-xs bg-[#2da0ad] hover:bg-[#288292] 
                                     transform hover:scale-105 transition-all duration-200 mb-4">
                            <PlusIcon />
                            <span className="font-semibold ml-2">Nueva Cuenta</span>
                        </button>
                    </div>


                    <ModalAlerta
                        isOpen={showModal}
                        onClose={() => {
                            setShowModal(false);
                            setErroresAlarma('');
                            setTempMontoAlarma(montoAlarma);
                        }}
                        onGuardar={handleGuardarAlarma}
                        montoAlarma={tempMontoAlarma}
                        onChange={handleTempMontoAlarmaChange}
                        errores={erroresAlarma}
                    />

                    <CrearCuenta
                        isOpen={showCreateModal}
                        onClose={() => setShowCreateModal(false)}
                        onGuardarCuenta={handleGuardarCuenta}
                    />

                    <EditarCuenta
                        isOpen={showEditModal}
                        onClose={() => {
                            setShowEditModal(false);
                            setCuentaSeleccionada(null);
                        }}
                        cuenta={cuentaSeleccionada}
                        onActualizar={handleActualizarCuenta}
                    />

                    <DeleteCuenta
                        isOpen={showDeleteModal}
                        onClose={() => {
                            setShowDeleteModal(false);
                            cuentaEliminar(null);
                        }}
                        onConfirm={handleConfirmarDelete}
                        accountName={cuentaEliminar?.alias}
                    />

                    {showNotification && (
                        <CustomAlert
                            title="¡Atención! Cuentas con saldo bajo"
                            messages={alertas.map(cuenta =>
                                `La cuenta ${cuenta.alias} tiene un saldo de $${Number(cuenta.saldo).toLocaleString("es-ES")}, por debajo del límite establecido ($${Number(montoAlarma).toLocaleString("es-ES")})`
                            )}
                            onClose={() => setShowNotification(false)}
                        />
                    )}

                    {/* Grid de tarjetas */}
                    <div className="flex md:flex-row flex-col md:flex-wrap gap-4">
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
                                    <ButtonForm
                                        text="Editar Datos"
                                        className="bg-white text-[#2da0ad] border-2 border-[#2da0ad] hover:bg-[#2da0ad] hover:text-white hover:border-white transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md"
                                        onClick={() => handleEditarClick(cuenta)}
                                    />
                                    <ButtonForm
                                        text="Eliminar"
                                        className="bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white hover:border-white"
                                        onClick={() => handleDeleteClick(cuenta)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Esquema>
    );
};

export default Cuentas;