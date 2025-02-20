import React, { useCallback, useEffect, useState } from "react";
import Esquema from "../Layouts/Esquema";
import { jwtDecode } from "jwt-decode";
import ButtonCustom from "../Components/Buttons/ButtonCustom";
import { useNavigate } from "react-router-dom";

const Principal = () => {
    const [info, setInfo] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Decoded:", decoded);
                if (decoded) {
                    setInfo(decoded);
                    localStorage.setItem("usuario_id", decoded.usuario_id);
                }
            } catch (error) {
                console.error("Error al decodificar el token:", error);
                setInfo("Token inválido");
            }
        } else {
            setInfo("Token no encontrado");
        }
    }, []);


    const capitalizarPrimeraLetra = (str) => {
        if (str.length === 0) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const handleOnClick = (ruta) => {
        console.log("Navegando a: ", ruta);
        if (!ruta) return;
        navigate(ruta);
    }

    return (
        <>
            <Esquema>
                <h1 className="bg-gradient-to-r from-[#49bdc7] to-[#83d7dd] text-transparent bg-clip-text text-4xl">
                    Bienvenido: {info && info.sub ? capitalizarPrimeraLetra(info.sub) : "Invitado"}
                </h1>
                <p className="text-gray-500">Selecciona una opción del menú</p>
                <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
                    <ButtonCustom
                        onClick={() => handleOnClick("/cuentas")}
                        defaultText="Cuentas"
                        hoverText="Administra tus cuentas"
                        bgColor="#b5e8ec"  // Color 200
                        textColor="#133039"  // Texto oscuro (Color 950)
                        hoverBgColor="#83d7dd"  // Hover: Color 300 (Más suave y acorde)
                        hoverTextColor="#133039"  // Hover: Texto oscuro para contraste
                    />

                    <ButtonCustom
                        onClick={() => handleOnClick("/perfil")}
                        defaultText="Perfil"
                        hoverText="Actualiza tu perfil"
                        bgColor="#83d7dd"  // Color 300
                        textColor="#133039"  // Texto oscuro
                        hoverBgColor="#b5e8ec"  // Hover: Color 200 (más claro y armónico)
                        hoverTextColor="#133039"  // Hover: Texto oscuro para buen contraste
                    />

                    <ButtonCustom
                        onClick={() => handleOnClick("/transacciones")}
                        defaultText="Transacciones"
                        hoverText="Registra tus movimientos"
                        bgColor="#49bdc7"  // Color 400
                        textColor="#133039"  // Texto oscuro
                        hoverBgColor="#83d7dd"  // Hover: Color 300 (Más suave)
                        hoverTextColor="#133039"  // Hover: Texto oscuro para contraste
                    />

                    <ButtonCustom
                        onClick={() => handleOnClick("/reportes")}
                        defaultText="Reportes"
                        hoverText="Ver estadísticas"
                        bgColor="#2da0ad"  // Color 500
                        textColor="#f0fbfb"  // Texto blanco
                        hoverBgColor="#49bdc7"  // Hover: Color 400 (Más claro y atractivo)
                        hoverTextColor="#133039"  // Hover: Texto oscuro para contraste
                    />
                </div>
            </Esquema>
        </>
    );
};
export default Principal;
