import { GET } from "../Fetch";

const generarReporte = async (cuenta_id) => {
    try {
        let rsp = await GET(`/reportes/totales/${cuenta_id}`);
        return rsp || [];
    } catch (error) {
        console.error("Error al generarReporte desde Reporte");
        return [];
    }
}
export default generarReporte