import React, { useEffect, useState } from "react";
import Esquema from "../Layouts/Esquema";

const Principal = () => {
    const [info, setInfo] = useState(null);

    useEffect(() => {
        const storedTransacciones = sessionStorage.getItem("transacciones");
        if (storedTransacciones) {
            const transacciones = JSON.parse(storedTransacciones);
            let usuario = transacciones.length > 0 ? transacciones[0].cuenta.usuario : null;
            setInfo(usuario);
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
                    Bienvenido: {info ? capitalizarPrimeraLetra(info.usuario) : "Cargando..."}
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
