import React, { useEffect, useState } from "react";
import Esquema from "../Layouts/Esquema";
import { jwtDecode } from "jwt-decode";
import ButtonCustom from "../Components/Buttons/ButtonCustom";

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
                    <ButtonCustom defaultText={"Cuenta"} hoverText={"Administra tus cuentas"} />
                    <ButtonCustom defaultText={"Transacciones"} hoverText={"Registra tus movimientos"} />
                    <ButtonCustom defaultText={"Reportes"} hoverText={"Genera reportes de tus finanzas"} />
                    <ButtonCustom defaultText={"Perfil"} hoverText={"Actualiza tu perfil"} />
                </div>
            </Esquema>
        </>
    );
};
export default Principal;
