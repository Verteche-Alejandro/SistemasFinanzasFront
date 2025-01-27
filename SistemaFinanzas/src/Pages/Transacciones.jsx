import { useEffect, useState } from "react";
import Esquema from "../Layouts/Esquema";
import NuevaTransac from "../Layouts/NuevaTransac";
import TableTransac from "../Layouts/TableTransac";
import { getCuentasByUsuarioId } from "../Services/Controllers/Cuenta";
import { jwtDecode } from "jwt-decode";

const Transacciones = () => {
    const [openModal, setOpenModal] = useState(false);
    const [cuentas, setCuentas] = useState([]);
    const [actualizarDatos, setActualizarDatos] = useState(false);

    // Obtener las cuentas al cargar el componente y cuando se actualicen los datos
    useEffect(() => {
        const obtenerCuentasUsuario = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                //Obtener el usuario_id
                const decoded = jwtDecode(token);
                const usuario_id = decoded.usuario_id;
                console.log("Id de usuario:", usuario_id);

                // Obtener cuentas del usuario
                const rsp = await getCuentasByUsuarioId(usuario_id);

                if (rsp && rsp.length > 0) {
                    // Guardar en sessionStorage y estado
                    sessionStorage.setItem('cuentasUsuario', JSON.stringify(rsp));
                    setCuentas(rsp);
                }
            } catch (error) {
                console.error("Error al obtener cuentas:", error);
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
                <h1 className="text-4xl font-bold text-gray-800">Transacciones</h1>
                <p className="text-gray-500">Registra tus movimientos</p>
                <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
                    <div className="bg-blue-500 text-white rounded p-4 text-center">
                        <button onClick={() => setOpenModal(true)}>
                            <p className="text-2xl font-bold">Ingresos</p>
                            <p>Registra tus ingresos</p>
                        </button>
                    </div>
                    <div className="bg-green-500 text-white rounded p-4 text-center">
                        <p className="text-2xl font-bold">Egresos</p>
                        <p>Registra tus egresos</p>
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        <TableTransac cuentas={cuentas} onActualizarCuentas={actualizarCuentas} />
                    </div>
                </div>
            </Esquema>

            <NuevaTransac
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                cuentas={cuentas}
                onActualizarCuentas={actualizarCuentas}
            />
        </>
    );
};

export default Transacciones;