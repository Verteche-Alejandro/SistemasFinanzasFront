import Esquema from "../Layouts/Esquema"
import ReporteTransac from "../Layouts/ReporteTransac";
import { useEffect, useState } from "react";
import { getCuentasByUsuarioId } from "../Services/Controllers/Cuenta"

const Reportes = () => {
    const [cuenta_id, setCuenta_id] = useState(0);

    useEffect(() => {
        const cargarCuentas = async () => {
            try {
                const id = localStorage.getItem("usuario_id");
                if (!id) {
                    setError("No se encontró el ID del usuario");
                    return;
                }

                let cuentasSession = sessionStorage.getItem("cuentasUsuario");
                let cuentasParseadas = cuentasSession ? JSON.parse(cuentasSession) : null;

                if (cuentasParseadas && cuentasParseadas.length > 0 && cuentasParseadas[0]?.usuario_id === id) {
                    setCuenta_id((prev) => prev || cuentasParseadas[0].cuenta_id);
                    return;
                }

                const response = await getCuentasByUsuarioId(id);
                if (!response || !Array.isArray(response) || response.length === 0) {
                    throw new Error("No se pudieron obtener las cuentas");
                }

                sessionStorage.setItem("cuentasUsuario", JSON.stringify(response));
                setCuenta_id((prev) => prev || response[0].cuenta_id); // Solo si no se ha asignado antes
            } catch (error) {
                console.error("Error:", error);
                setError(error.message);
            }
        };

        cargarCuentas();
    }, []);


    return (
        <>
            <Esquema>
                {cuenta_id && <ReporteTransac cuenta_id={cuenta_id} />}
            </Esquema>
        </>
    )
}
export default Reportes