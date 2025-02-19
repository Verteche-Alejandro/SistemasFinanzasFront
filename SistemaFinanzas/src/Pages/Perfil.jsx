import { useEffect, useState } from "react";
import Esquema from "../Layouts/Esquema"
import PerfilUsuario from "../Layouts/PerfilUsuario"
import { getUsuarioById } from "../Services/Controllers/Usuario";

const Perfil = () => {
    const [usuario, setUsuario] = useState({});

    useEffect(() => {
        const ObtenerDatosUsuario = async () => {
            try {
                const id = localStorage.getItem("usuario_id");
                let rsp = await getUsuarioById(id);
                if (rsp) {
                    setUsuario(rsp);
                }
            } catch (error) {
                console.error("Error en la solicitud GET en Perfil:", error);
            }
        }
        ObtenerDatosUsuario();
    }, []);

    return (
        <>
            <Esquema>
                <div className="flex items-center justify-between">
                    <h1 className="bg-gradient-to-r from-[#49bdc7] to-[#83d7dd] text-transparent bg-clip-text text-4xl">Perfil de Usuario</h1>
                </div>
                <PerfilUsuario info={usuario} />
            </Esquema>
        </>
    );
}
export default Perfil;