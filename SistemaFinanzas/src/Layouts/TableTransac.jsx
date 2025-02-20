import { eliminarTransaccion } from "../Services/Controllers/Transaccion";
import Table from "../Components/Tables/Table";
import DeleteIcon from "../Assets/Icons/DeleteIcon";
import ButtonForm from "../Components/Buttons/ButtonForm";

const TableTransac = ({ transacciones, onActualizarCuentas }) => {
    const headers = [
        "Fecha",
        "Monto",
        "Tipo",
        "Cuenta/Alias",
        "Moneda",
        "Acciones",
    ];

    const eliminar = async (transac_id) => {
        if (transac_id) {
            try {
                await eliminarTransaccion(transac_id);
                if (onActualizarCuentas) {
                    await onActualizarCuentas();
                }
            } catch (error) {
                console.error("Error al eliminar la transacción:", error);
            }
        }
    };

    function formatearNumero(num) {
        return num.toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    return (
        <Table headers={headers}>
            {transacciones && transacciones.length > 0 ? (
                transacciones.map((transaccion, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                            {new Date(transaccion.fecha).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                            ${formatearNumero(transaccion.monto)}
                        </td>
                        <td className="px-4 py-2">
                            {transaccion.tipo_transaccion}
                        </td>
                        <td className="px-4 py-2">
                            {transaccion.cuenta.alias}
                        </td>
                        <td className="px-4 py-2">
                            ({transaccion.cuenta.moneda.simbolo}) {transaccion.cuenta.moneda.nombre}
                        </td>
                        <td className="px-4 py-2 flex flex-wrap justify-center space-x-2">
                            <ButtonForm className="bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white hover:border-white"
                                onClick={() => eliminar(transaccion.transac_id)}
                                text="Eliminar"
                                icono={<DeleteIcon />}>
                            </ButtonForm>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={headers.length} className="text-center py-4 text-gray-500">
                        Sin datos disponibles
                    </td>
                </tr>
            )}
        </Table>
    );
};

export default TableTransac;