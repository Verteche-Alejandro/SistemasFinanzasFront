import { useEffect, useState } from "react";
import Esquema from "../Layouts/Esquema";
import ButtonForm from "../Components/Buttons/ButtonForm";
import Buscador from "../Components/Inputs/Buscador";
import TableTransac from "../Layouts/TableTransac";
import NuevaTransac from "../Layouts/NuevaTransac";
import { getTransaccionesByCuenta, buscarTransaccionPorAlias } from "../Services/Controllers/Transaccion";
import { getCuentasByUsuarioId } from "../Services/Controllers/Cuenta";
import PlusIcon from "../Assets/Icons/PlusIcon"
import SelectForm from "../Components/Inputs/SelectForm";

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
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <div className="border-b pb-4">
                    <h1 className="bg-gradient-to-r from-[#49bdc7] to-[#83d7dd] text-transparent bg-clip-text text-4xl">
                        Gestionar Transacciones
                    </h1>
                    <p className="text-gray-500 mt-2">Registra y gestiona tus movimientos</p>
                </div>

                {/* Controls Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
                    {/* Primera fila: Botón nuevo y buscador */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <ButtonForm
                            text="Nueva transacción"
                            onClick={() => setOpenModal(true)}
                            className="flex text-white items-center rounded-lg px-4 py-2 w-full sm:w-auto
                                     bg-[#2da0ad] hover:bg-[#288292] transform hover:scale-105 
                                     transition-all duration-200 justify-center sm:justify-start"
                            icono={<PlusIcon className="mr-2" />}
                        />
                        <div className="w-full sm:w-96">
                            <Buscador
                                onSearch={buscar}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Segunda fila: Filtro */}
                    <div className="flex justify-end">
                        <div className="w-full sm:w-64">
                            <SelectForm
                                label="Filtrar por tipo"
                                name="tipoFiltro"
                                value={tipoFiltro}
                                onChange={(e) => filtrarPorTipo(e.target.value)}
                                options={[
                                    { value: "", label: "Todos" },
                                    { value: "DEPOSITO", label: "Depósito" },
                                    { value: "TRANSFERENCIA", label: "Transferencia" },
                                    { value: "PAGO", label: "Pago" },
                                    { value: "RETIRO", label: "Retiro" },
                                ]}
                                titleOption="Selecciona un tipo"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-sm">
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
