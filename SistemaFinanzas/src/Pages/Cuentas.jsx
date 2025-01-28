import { useState, useEffect } from "react";
import Esquema from "../Layouts/Esquema";

const Cuentas = () => {
    const [cuentas, setCuentas] = useState([]);
    const [actualizarDatos, setActualizarDatos] = useState(false);

    // Obtener las cuentas al cargar el componente y cuando se actualicen los datos
    useEffect(() => {
        const obtenerCuentasUsuario = () => {
            try {
                let cuentasSession = sessionStorage.getItem("cuentasUsuario");
                if (cuentasSession) {
                    const cuentasParseadas = JSON.parse(cuentasSession); // Convertir el JSON string a un array
                    setCuentas(cuentasParseadas); // Actualizar el estado con las cuentas
                }
            } catch (error) {
                console.error("Error al obtener las cuentas desde sessionStorage:", error);
            }
        };
        obtenerCuentasUsuario();
    }, [actualizarDatos]); // Se ejecuta cuando actualizarDatos cambia

    // Función para forzar la actualización de datos
    const actualizarCuentas = () => {
        setActualizarDatos(prev => !prev);
    };

    return (
        <>
            <Esquema>
                <div className="flex flex-col p-6 justify-center">
                    {/* Título de la sección */}
                    <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
                        Mis Cuentas
                    </h1>
                    <p className="text-lg text-center text-gray-600 mb-12">
                        Aquí puedes ver el resumen de tus cuentas, saldos y detalles asociados.
                    </p>

                    {/* Lista de tarjetas con las cuentas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {cuentas.map((cuenta) => (
                            <div
                                key={cuenta.cuenta_id}
                                className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between h-full transform transition-transform duration-300 hover:scale-105">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{cuenta.alias}</h2> {/* Título de la tarjeta */}
                                <div className="flex-grow">
                                    <p className="text-gray-600 mb-2">Tipo de Cuenta: {cuenta.tipoDeCuenta}</p>
                                    <p className="text-gray-600 mb-2">Moneda: {cuenta.moneda?.nombre}</p>
                                    <p className="mt-4 text-3xl font-bold text-center text-green-600">Saldo: ${cuenta.saldo}</p>
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
        </>
    );
};

export default Cuentas;
