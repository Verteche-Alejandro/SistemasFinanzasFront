import { useEffect, useState } from "react";
import Esquema from "../Layouts/Esquema";
import NuevaTransac from "../Layouts/NuevaTransac";
import TableTransac from "../Layouts/TableTransac";
import { getCuentasByUsuarioId } from "../Services/Controllers/Cuenta";
import { jwtDecode } from "jwt-decode";
import Buscador from "../Components/Inputs/Buscador";
import { buscarTransaccionPorAlias } from "../Services/Controllers/Transaccion";
import ButtonForm from "../Components/Buttons/ButtonForm";

const Transacciones = () => {
    const [openModal, setOpenModal] = useState(false);
    const [cuentas, setCuentas] = useState([]);
    const [actualizarDatos, setActualizarDatos] = useState(false);
    const [transaccionesxalias, setTransaccionesxalias] = useState([]);
    const [alias, setAlias] = useState("");

    // Obtener las cuentas al cargar el componente y cuando se actualicen los datos
    useEffect(() => {
        const obtenerCuentasUsuario = async () => {
            const id = localStorage.getItem("usuario_id");
            if (!id) return;

            try {
                // Obtener cuentas del usuario
                const rsp = await getCuentasByUsuarioId(id);

                if (rsp && rsp.length > 0) {
                    // Guardar en sessionStorage y estado
                    sessionStorage.setItem('cuentasUsuario', JSON.stringify(rsp));
                    setCuentas(rsp);
                }
            } catch (error) {
                console.error("Error al obtener cuentas:", error);
            }
        };

        obtenerCuentasUsuario();
    }, [actualizarDatos]); // Se ejecuta cuando actualizarDatos cambia

    const buscar = async (e) => {
        const alias = e.target.value; // Tomamos el valor del input
        setAlias(alias); // Actualizamos el alias en el estado

        try {
            console.log("Buscando transacciones por alias...", alias);
            let response = await buscarTransaccionPorAlias(alias);
            console.log("Transacciones encontradas:", response);
            if (response && response.length > 0) {
                setTransaccionesxalias(response);
            } else {
                setTransaccionesxalias([]);
            }
        } catch (error) {
            console.error("Error al buscar transacciones por alias:", error);
        }
    };

    // Función para forzar la actualización de datos
    const actualizarCuentas = () => {
        setActualizarDatos(prev => !prev);
    };

    return (
        <>
            <Esquema>
                <h1 className="text-4xl font-bold text-gray-800">Gestionar Transacciones</h1>
                <p className="text-gray-500">Registra tus movimientos</p>
                <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
                    <ButtonForm text="Nueva Transaccion" className="animated-button" onClick={() => setOpenModal(true)} />
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex flex-row gap-4 justify-start w-full">
                            <Buscador onChange={buscar} />
                        </div>
                        <TableTransac cuentas={cuentas} onActualizarCuentas={actualizarCuentas} />
                    </div>
                </div>
            </Esquema>

            <NuevaTransac
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                cuentas={cuentas}
                onActualizarCuentas={actualizarCuentas}
            />
        </>
    );
};

export default Transacciones;