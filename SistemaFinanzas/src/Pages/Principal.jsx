import React, { useEffect, useState } from "react";
import Esquema from "../Layouts/Esquema";
import { jwtDecode } from "jwt-decode";

const Principal = () => {
    const [info, setInfo] = useState("");

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

    return (
        <>
            <Esquema>
                <h1 className="text-4xl font-bold text-gray-800">
                    Bienvenido: {capitalizarPrimeraLetra(info.sub)}
                </h1>
                <p className="text-gray-500">Selecciona una opción del menú</p>
                <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
                    <div className="bg-blue-500 text-white rounded p-4 text-center">
                        <p className="text-2xl font-bold">Cuentas</p>
                        <p>Administra tus cuentas</p>
                    </div>
                    <div className="bg-green-500 text-white rounded p-4 text-center">
                        <p className="text-2xl font-bold">Movimientos</p>
                        <p>Registra tus movimientos</p>
                    </div>
                    <div className="bg-yellow-500 text-white rounded p-4 text-center">
                        <p className="text-2xl font-bold">Reportes</p>
                        <p>Genera reportes de tus finanzas</p>
                    </div>
                    <div className="bg-red-500 text-white rounded p-4 text-center">
                        <p className="text-2xl font-bold">Perfil</p>
                        <p>Actualiza tu perfil</p>
                    </div>
                </div>
            </Esquema>
        </>
    );
};
export default Principal;
