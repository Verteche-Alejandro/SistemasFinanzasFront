import { useEffect, useState } from "react";
import Esquema from "../Layouts/Esquema";
import ReporteTransac from "../Layouts/ReporteTransac";
import { getCuentasByUsuarioId } from "../Services/Controllers/Cuenta";

const Reportes = () => {
    const [cuentas, setCuentas] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarCuentas = async () => {
            try {
                const id = localStorage.getItem("usuario_id");
                if (!id) {
                    setError("No se encontró el ID del usuario");
                    return;
                }

                let cuentasSession = sessionStorage.getItem("cuentasUsuario");
                let cuentasParseadas = cuentasSession ? JSON.parse(cuentasSession) : null;

                if (cuentasParseadas && cuentasParseadas.length > 0 && cuentasParseadas[0]?.usuario_id === id) {
                    setCuentas(cuentasParseadas);
                    return;
                }

                const response = await getCuentasByUsuarioId(id);
                if (!response || !Array.isArray(response) || response.length === 0) {
                    throw new Error("No se pudieron obtener las cuentas");
                }

                sessionStorage.setItem("cuentasUsuario", JSON.stringify(response));
                setCuentas(response);
            } catch (error) {
                console.error("Error:", error);
                setError(error.message);
            }
        };
        cargarCuentas();
    }, []);

    if (error) {
        return (
            <Esquema>
                <div className="p-6">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                </div>
            </Esquema>
        );
    }

    return (
        <Esquema>
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <div className="border-b pb-4">
                    <h1 className="bg-gradient-to-r from-[#49bdc7] to-[#83d7dd] text-transparent bg-clip-text text-4xl">
                        Reportes de Transacciones
                    </h1>
                    <p className="text-gray-500 mt-2">Visualización de movimientos por cuenta</p>
                </div>

                {/* Reportes Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {cuentas.map((cuenta) => (
                        <div key={cuenta.cuenta_id} className="bg-white rounded-lg shadow-sm p-6">
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Cuenta: {cuenta.alias}
                                </h2>
                                <p className="text-gray-500">
                                    {cuenta.moneda.simbolo} {cuenta.moneda.nombre}
                                </p>
                            </div>
                            <div className="h-[60vh] w-full">
                                <ReporteTransac cuenta_id={cuenta.cuenta_id} />
                            </div>
                        </div>
                    ))}
                </div>

                {cuentas.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <div className="space-y-3">
                            <p className="text-gray-500 text-lg">No hay cuentas disponibles</p>
                            <p className="text-gray-400">Crea una cuenta para ver los reportes</p>
                        </div>
                    </div>
                )}
            </div>
        </Esquema>
    );
};

export default Reportes;