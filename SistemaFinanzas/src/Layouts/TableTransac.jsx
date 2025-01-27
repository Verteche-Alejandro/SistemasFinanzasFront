import { useState, useEffect } from "react";
import Table from "../Components/Tables/Table";
import { getTransaccionesByCuenta } from "../Services/Controllers/Transaccion";

const TableTransac = ({ cuentas }) => {
    const [transacciones, setTransacciones] = useState([]);
    const headers = [
        "Fecha",
        "Monto",
        "Tipo",
        "Cuenta/Alias",
        "Moneda",
        "Acciones",
    ];

    // Obtener las transacciones para todas las cuentas
    useEffect(() => {
        const fetchTransacciones = async () => {
            try {
                if (cuentas.length > 0) {
                    const transaccionesEncontradas = cuentas.map((cuenta) =>
                        getTransaccionesByCuenta(cuenta.cuenta_id)
                    );

                    const transaccionesArray = await Promise.all(transaccionesEncontradas);
                    const transacciones = transaccionesArray.flat(); // Combina los resultados de todas las transacciones
                    setTransacciones(transacciones);
                } else {
                    console.log("No hay cuentas para obtener transacciones");
                }
            } catch (error) {
                console.error("Error en fetchTransacciones:", error);
            }
        };

        fetchTransacciones();
    }, [cuentas]); // Se ejecuta cuando cambian las cuentas

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