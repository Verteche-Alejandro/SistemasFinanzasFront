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
            <div className="p-6">
                <h1 className="bg-gradient-to-r from-[#49bdc7] to-[#83d7dd] text-transparent bg-clip-text text-4xl mb-2">Gestionar Transacciones</h1>
                <p className="text-gray-500 mb-6">Registra y gestiona tus movimientos</p>

                {/* Filtros y botones */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2 mt-2">
                    <ButtonForm
                        text="Nueva transaccion"
                        onClick={() => setOpenModal(true)}
                        className="flex text-white items-center rounded-lg p-2 max-w-xs bg-[#2da0ad] hover:bg-[#288292] 
                                     transform hover:scale-105 transition-all duration-200"
                        icono={<PlusIcon />}>
                    </ButtonForm>
                    <Buscador onSearch={buscar} className="w-full sm:w-60" />
                    <div className="flex flex-col justify-between w-full sm:w-auto">
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
                            className="w-50"
                        />
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
