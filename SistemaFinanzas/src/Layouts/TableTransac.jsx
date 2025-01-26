import { useState, useEffect } from "react";
import Table from "../Components/Tables/Table";
import { getTransaccionesByCuenta } from "../Services/Controllers/Transaccion";
import { getCuentasByUsuarioId } from "../Services/Controllers/Cuenta";
import { jwtDecode } from "jwt-decode";

const TableTransac = () => {
    const [transacciones, setTransacciones] = useState([]);
    const [usuario_id, setUsuario_id] = useState(null);
    const [cuentas, setCuentas] = useState([]);
    const headers = [
        "Fecha",
        "Monto",
        "Tipo",
        "Cuenta/Alias",
        "Moneda",
        "Acciones",
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Decoded:", decoded);
                setUsuario_id(decoded.usuario_id || null);
            } catch (error) {
                console.error("Error al decodificar el token:", error);
            }
        } else {
            console.warn("Token no encontrado");
        }
    }, []);

    // Obtener las cuentas asociadas al usuario
    useEffect(() => {
        const fetchCuentas = async () => {
            if (usuario_id) {
                try {
                    const rsp = await getCuentasByUsuarioId(usuario_id);
                    if (rsp && rsp.length > 0) {
                        setCuentas(rsp);
                        sessionStorage.setItem("cuentas", JSON.stringify(rsp));
                    } else {
                        console.log("No hay cuentas disponibles");
                    }
                } catch (error) {
                    console.error("Error en fetchCuentas:", error);
                }
            }
        };
        fetchCuentas();
    }, [usuario_id]);

    // Obtener las transacciones para todas las cuentas
    useEffect(() => {
        const fetchTransacciones = async () => {
            try {
                if (cuentas.length > 0) {
                    const transaccionesEncontradas = cuentas.map((cuenta) =>
                        getTransaccionesByCuenta(cuenta.cuenta_id)
                    );

                    const transaccionesArray = await Promise.all(transaccionesEncontradas);
                    const transacciones = transaccionesArray.flat(); // Combina los resultados de todas las transacciones por cuenta en un solo array
                    setTransacciones(transacciones);
                } else {
                    console.log("No hay cuentas para obtener transacciones");
                }
            } catch (error) {
                console.error("Error en fetchTransacciones:", error);
            }
        };
        fetchTransacciones();
    }, [cuentas]);

    return (
        <Table headers={headers}>
            {transacciones.length > 0 ? (
                transacciones.map((transaccion, index) => (
                    <tr key={index}>
                        <td>{new Date(transaccion.fecha).toLocaleDateString()}</td>
                        <td>${transaccion.monto}</td>
                        <td>{transaccion.tipo_transaccion}</td>
                        <td>{transaccion.cuenta.alias}</td>
                        <td>
                            ({transaccion.cuenta.moneda.simbolo}){" "}
                            {transaccion.cuenta.moneda.nombre}
                        </td>
                        <td className="p-2 flex flex-wrap justify-center space-x-2">
                            <button className="rounded-lg bg-red-600 p-2 text-white">
                                Eliminar
                            </button>
                            <button className="rounded-lg bg-yellow-500 p-2 text-white">
                                Modificar
                            </button>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={headers.length} className="text-center py-4">
                        Sin datos disponibles
                    </td>
                </tr>
            )}
        </Table>
    );
};

export default TableTransac;
