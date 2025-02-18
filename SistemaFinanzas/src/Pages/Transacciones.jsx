import { useEffect, useState } from "react";
import Esquema from "../Layouts/Esquema";
import ButtonForm from "../Components/Buttons/ButtonForm";
import Buscador from "../Components/Inputs/Buscador";
import TableTransac from "../Layouts/TableTransac";
import NuevaTransac from "../Layouts/NuevaTransac";
import { getTransaccionesByCuenta, buscarTransaccionPorAlias } from "../Services/Controllers/Transaccion";
import { getCuentasByUsuarioId } from "../Services/Controllers/Cuenta";
import PlusIcon from "../Assets/Icons/PlusIcon"

const Transacciones = () => {
    const [openModal, setOpenModal] = useState(false);
    const [cuentas, setCuentas] = useState([]);
    const [actualizarDatos, setActualizarDatos] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [transacciones, setTransacciones] = useState([]);
    const [transaccionesFiltradas, setTransaccionesFiltradas] = useState([]);
    const [tipoFiltro, setTipoFiltro] = useState("");

    const filtrarPorTipo = (tipo) => {
        setTipoFiltro(tipo);
        if (tipo === "") {
            setTransaccionesFiltradas(transacciones);
        } else {
            const filtradas = transacciones.filter(trans => trans.tipo_transaccion === tipo);
            setTransaccionesFiltradas(filtradas);
        }
    };

    useEffect(() => {
        const cargarDatos = async () => {
            const id = localStorage.getItem("usuario_id");
            if (!id) return;

            try {
                setCargando(true);
                const cuentasResponse = await getCuentasByUsuarioId(id);
                if (cuentasResponse && cuentasResponse.length > 0) {
                    setCuentas(cuentasResponse);
                    const todasLasTransacciones = await Promise.all(
                        cuentasResponse.map(cuenta => getTransaccionesByCuenta(cuenta.cuenta_id))
                    );
                    const transaccionesPlanas = todasLasTransacciones.flat();
                    setTransacciones(transaccionesPlanas);
                    setTransaccionesFiltradas(transaccionesPlanas);
                }
            } catch (error) {
                console.error("Error al cargar datos:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarDatos();
    }, [actualizarDatos]);

    useEffect(() => {
        filtrarPorTipo(tipoFiltro);
    }, [transacciones, tipoFiltro]);

    const cargarTodasLasTransacciones = async () => {
        try {
            const todasLasTransacciones = await Promise.all(
                cuentas.map(cuenta => getTransaccionesByCuenta(cuenta.cuenta_id))
            );
            const listaTransacciones = todasLasTransacciones.flat();
            setTransacciones(listaTransacciones);
            setTransaccionesFiltradas(listaTransacciones);
        } catch (error) {
            console.error("Error al cargar todas las transacciones:", error);
            setTransacciones([]);
            setTransaccionesFiltradas([]);
        }
    };

    const buscar = async (alias) => {
        try {
            setCargando(true);
            if (alias.trim() === "") {
                await cargarTodasLasTransacciones();
            } else {
                const resultado = await buscarTransaccionPorAlias(alias);
                setTransacciones(Array.isArray(resultado) ? resultado : []);
                setTransaccionesFiltradas(Array.isArray(resultado) ? resultado : []);
            }
        } catch (error) {
            console.error("Error general en la búsqueda:", error);
            setTransacciones([]);
            setTransaccionesFiltradas([]);
        } finally {
            setCargando(false);
        }
    };

    const actualizarCuentas = async () => {
        setActualizarDatos(prev => !prev);
    };

    return (
        <Esquema>
            <div className="p-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Gestionar Transacciones</h1>
                <p className="text-gray-500 mb-6">Registra y gestiona tus movimientos</p>

                {/* Filtros y botones */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <ButtonForm
                        text="Nueva Transacción"
                        className="animated-button"
                        onClick={() => setOpenModal(true)}
                        icono={<PlusIcon/>}
                    />
                    <div className="flex flex-wrap gap-4 justify-between w-full sm:w-auto">
                        <Buscador onSearch={buscar} className="w-full sm:w-60" />
                        <select
                            value={tipoFiltro}
                            onChange={(e) => filtrarPorTipo(e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded-md shadow text-sm w-full sm:w-auto">
                            <option value="">Todos</option>
                            <option value="DEPOSITO">Depósito</option>
                            <option value="TRANSFERENCIA">Transferencia</option>
                            <option value="PAGO">Pago</option>
                            <option value="RETIRO">Retiro</option>
                        </select>
                    </div>
                </div>

                {/* Loader */}
                {cargando ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Cargando...</p>
                    </div>
                ) : (
                    <TableTransac
                        transacciones={transaccionesFiltradas}
                        onActualizarCuentas={actualizarCuentas}
                    />
                )}
            </div>

            {/* Modal Nueva Transacción */}
            <NuevaTransac
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                cuentas={cuentas}
                onActualizarCuentas={actualizarCuentas}
            />
        </Esquema>
    );
};

export default Transacciones;
