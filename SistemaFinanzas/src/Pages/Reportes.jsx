import Esquema from "../Layouts/Esquema"
import ReporteTransac from "../Layouts/ReporteTransac";
import { useEffect, useState } from "react";

const Reportes = () => {
    const [cuenta_id, setCuenta_id] = useState(0);

    useEffect(() => {
        const cargarCuentas = async () => {
            try {
                const id = localStorage.getItem("usuario_id");
                if (!id) {
                    setError("No se encontro el id del usuario");
                    setLoading(false);
                    return;
                }

                let cuentasSession = sessionStorage.getItem("cuentasUsuario");
                let cuentasParseadas = cuentasSession ? JSON.parse(cuentasSession) : null;
                if (cuentasParseadas && cuentasParseadas.length) {
                    setCuenta_id(cuentasParseadas[0].cuenta_id); // Asigna el primer cuenta_id válido
                }


                if (!cuentasParseadas || !cuentasParseadas.length || cuentasParseadas[0]?.usuario_id !== id) {
                    const response = await getCuentasByUsuarioId(id);

                    if (!response) {
                        throw new Error("No se pudieron obtener las cuentas");
                    }

                    sessionStorage.setItem("cuentasUsuario", JSON.stringify(response));
                    setCuenta_id(response.cuenta_id);
                } else {
                    setCuenta_id(cuentasParseadas);
                }

                const montoAlarmaSession = sessionStorage.getItem(`montoAlarma_${id}`);
                if (montoAlarmaSession) {
                    setMontoAlarma(montoAlarmaSession);
                }

            } catch (error) {
                console.error("Error:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        cargarCuentas();
    }, []);

    return (
        <>
            <Esquema>
                {cuenta_id !== 0 && <ReporteTransac cuenta_id={cuenta_id} />}
            </Esquema>
        </>
    )
}
export default Reportes