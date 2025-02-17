import { useState, useEffect } from "react";
import Table from "../Components/Tables/Table";
import { getTransaccionesByCuenta, eliminarTransaccion } from "../Services/Controllers/Transaccion";

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

    // Manejar la eliminación de una transacción
    const eliminar = async (transac_id) => {
        if (transac_id) {
            try {
                await eliminarTransaccion(transac_id);
                // Filtrar las transacciones para eliminar la transacción borrada
                const nuevasTransacciones = transacciones.filter(transaccion => transaccion.transac_id !== transac_id);
                setTransacciones(nuevasTransacciones);
            } catch (error) {
                console.error("Error al eliminar la transacción:", error);
            }
        }
    };

    function formatearNumero(num) {
        return num.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }


    return (
        <Table headers={headers}>
            {transacciones.length > 0 ? (
                transacciones.map((transaccion, index) => (
                    <tr key={index}>
                        <td>{new Date(transaccion.fecha).toLocaleDateString()}</td>
                        <td>${formatearNumero(transaccion.monto)}</td>
                        <td>{transaccion.tipo_transaccion}</td>
                        <td>{transaccion.cuenta.alias}</td>
                        <td>({transaccion.cuenta.moneda.simbolo}) {transaccion.cuenta.moneda.nombre}</td>
                        <td className="p-2 flex flex-wrap justify-center space-x-2">
                            <button
                                className="rounded-lg bg-red-600 p-2 text-white"
                                onClick={() => eliminar(transaccion.transac_id)}>
                                Eliminar
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
