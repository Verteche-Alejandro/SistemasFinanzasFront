import { useState, useEffect } from "react";
import Table from "../Components/Tables/Table";
import { getTransaccionesByCuenta } from "../Services/Controllers/Transaccion";

const TableTransac = () => {
    const [transacciones, setTransacciones] = useState([]);

    const headers = [
        "Fecha",
        "Monto",
        "Tipo",
        "Cuenta/Alias",
        "Moneda",
        "Acciones"
    ];


    useEffect(() => {
        const fetchTransacciones = async () => {
            try {
                const rsp = await getTransaccionesByCuenta(1);
                if (rsp && rsp.length > 0) {
                    setTransacciones(rsp);
                } else {
                    console.log("No hay transacciones disponibles");
                }
            } catch (error) {
                console.error("Error en fetchTransacciones:", error);
            }
        };

        fetchTransacciones();
    }, []);

    return (
        <Table headers={headers}>
            {transacciones.length > 0 ? (
                transacciones.map((transaccion, index) => (
                    <tr key={index}>
                        <td>{new Date(transaccion.fecha).toLocaleDateString()}</td> {/* Fecha formateada */}
                        <td>${transaccion.monto}</td> {/* Monto */}
                        <td>{transaccion.tipo_transaccion}</td> {/* Tipo de transacción */}
                        <td>{transaccion.cuenta.alias}</td> {/* Alias de la cuenta */}
                        <td>({transaccion.cuenta.moneda.simbolo}) {transaccion.cuenta.moneda.nombre}</td> {/* Moneda */}
                        <td className="p-2 flex flex-wrap justify-center space-x-2">
                            <button className="rounded-lg bg-red-600 p-2 text-white">Eliminar</button>
                            <button className="rounded-lg bg-yellow-500 p-2 text-white">Modificar</button>
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



    )
}

export default TableTransac;