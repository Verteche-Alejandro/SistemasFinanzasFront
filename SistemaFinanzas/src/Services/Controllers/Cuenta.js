import { GETBYID } from '../Fetch';

export const getCuentasByUsuarioId = async (usuario_id) => {
    try {
        let rsp = await GETBYID(`/controller/cuentas/usuario/${usuario_id}`);
        return rsp || [];
    } catch (error) {
        console.error("Error en la solicitud GET en cuenta:", error);
        return [];
    }
}