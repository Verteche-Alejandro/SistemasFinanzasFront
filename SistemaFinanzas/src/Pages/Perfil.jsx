import { useEffect, useState } from "react";
import Esquema from "../Layouts/Esquema"
import PerfilUsuario from "../Layouts/PerfilUsuario"
import { getUsuarioById } from "../Services/Controllers/Usuario";

const Perfil = () => {
    const [usuario, setUsuario] = useState({});
    const [loading, setLoading] = useState(true);
    const [errores, setErrores] = useState(null);

    useEffect(() => {
        const obtenerDatosUsuario = async () => {
            setLoading(true);
            setErrores(null);

            try {
                const id = localStorage.getItem("usuario_id");

                if (!id) {
                    throw new Error("No se encontró ID de usuario");
                }

                const rsp = await getUsuarioById(id);
                if (rsp) {
                    setUsuario(rsp);
                } else {
                    throw new Error("No se pudo obtener la información del usuario");
                }
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error);
                setErrores(error.message || "Error al cargar el perfil");
            } finally {
                setLoading(false);
            }
        };

        obtenerDatosUsuario();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#49bdc7]"></div>
                </div>
            );
        }

        if (errores) {
            <Esquema>
                <div className="p-6">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {errores}
                    </div>
                </div>
            </Esquema>
        }

        if (!usuario) {
            <Esquema>
                <div className="p-6">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p>Sin datos</p>
                        <p>No se encontro informacion del usuario</p>
                    </div>
                </div>
            </Esquema>
        }

        return <PerfilUsuario info={usuario} />;
    };

    return (
        <>
            <Esquema>
                <div className="flex items-center justify-between">
                    <h1 className="bg-gradient-to-r from-[#49bdc7] to-[#83d7dd] text-transparent bg-clip-text text-4xl">Perfil de Usuario</h1>
                </div>
                {renderContent()}
            </Esquema>
        </>
    );
}
export default Perfil;