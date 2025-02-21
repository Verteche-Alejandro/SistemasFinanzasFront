import { useState, useEffect } from 'react';
import { eliminarTransaccion } from "../Services/Controllers/Transaccion";
import Table from "../Components/Tables/Table";
import DeleteIcon from "../Assets/Icons/DeleteIcon";
import ButtonForm from "../Components/Buttons/ButtonForm";
import ArrowLeft from "../Assets/Icons/ArrowLeft"
import ArrowRight from "../Assets/Icons/ArrowRight"

const TableTransac = ({ transacciones, onActualizarCuentas }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [transaccionesFiltradas, setTransaccionesFiltradas] = useState([]);
    const transaccionesPorPagina = 6;

    const headers = [
        "Fecha",
        "Monto",
        "Tipo",
        "Cuenta/Alias",
        "Moneda",
        "Acciones",
    ];

    // Actualizar las transacciones filtradas cuando cambien las transacciones principales
    useEffect(() => {
        setTransaccionesFiltradas(transacciones);
        setCurrentPage(1); // Reset a la primera página cuando cambian las transacciones
    }, [transacciones]);

    // Si no hay transacciones, mostrar mensaje en lugar de la tabla
    if (!transaccionesFiltradas || transaccionesFiltradas.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm min-h-[400px] flex items-center justify-center">
                <div className="space-y-3">
                    <p className="text-gray-500 text-lg">No se encontraron transacciones</p>
                    <p className="text-gray-400">Intenta con otros criterios de búsqueda</p>
                </div>
            </div>
        );
    }

    // Cálculos para la paginación
    const indexUltimaTransaccion = currentPage * transaccionesPorPagina;
    const indexPrimeraTransaccion = indexUltimaTransaccion - transaccionesPorPagina;
    const transaccionesActuales = transaccionesFiltradas.slice(indexPrimeraTransaccion, indexUltimaTransaccion);
    const totalPaginas = Math.ceil(transaccionesFiltradas.length / transaccionesPorPagina);

    // Calcular cuántas filas vacías necesitamos
    const filasVaciasNecesarias = transaccionesPorPagina - transaccionesActuales.length;

    const formatearFecha = (fechaString) => {
        const [year, month, day] = fechaString.split('-');
        const fecha = new Date(year, month - 1, day);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'UTC'
        });
    };

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

    const formatearNumero = (num) => {
        return num.toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const cambiarPagina = (numeroPagina) => {
        setCurrentPage(numeroPagina);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-center items-center min-h-[400px]">
                <Table headers={headers}>
                    {transaccionesActuales.map((transaccion, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2">
                                {formatearFecha(transaccion.fecha)}
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
                                <ButtonForm
                                    className="bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white hover:border-white"
                                    onClick={() => eliminar(transaccion.transac_id)}
                                    text="Eliminar"
                                    icono={<DeleteIcon />}
                                />
                            </td>
                        </tr>
                    ))}
                    {/* Agregar filas vacías para mantener altura consistente */}
                    {[...Array(filasVaciasNecesarias)].map((_, index) => (
                        <tr key={`empty-${index}`}>
                            {headers.map((_, colIndex) => (
                                <td key={colIndex} className="px-4 py-2 border-b border-gray-200">
                                    &nbsp;
                                </td>
                            ))}
                        </tr>
                    ))}
                </Table>
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-2 py-4">
                    <ButtonForm
                        onClick={() => cambiarPagina(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 disabled:opacity-50"
                        icono={<ArrowLeft />}
                    />

                    <div className="flex gap-2">
                        {[...Array(totalPaginas)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => cambiarPagina(index + 1)}
                                className={`px-3 py-1 rounded ${currentPage === index + 1
                                        ? 'bg-[#2da0ad] text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <ButtonForm
                        onClick={() => cambiarPagina(currentPage + 1)}
                        disabled={currentPage === totalPaginas}
                        className="p-2 disabled:opacity-50"
                        icono={<ArrowRight />}
                    />
                </div>
            )}
        </div>
    );
};

export default TableTransac;