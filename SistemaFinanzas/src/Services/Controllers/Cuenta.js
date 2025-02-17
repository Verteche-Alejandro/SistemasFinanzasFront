import { GETBYID, POST,DELETE } from '../Fetch';

export const createCuenta = async (data) => {
    try {
        let rsp = await POST("/controller/cuentas/crear", data);
        return rsp || {};
    } catch (error) {
        console.error("Error en la solicitud POST en cuenta:", error);
        return {};
    }
}

export const getCuentasByUsuarioId = async (usuario_id) => {
    try {
        let rsp = await GETBYID(`/controller/cuentas/usuario/${usuario_id}`);
        return rsp || [];
    } catch (error) {
        console.error("Error en la solicitud GET en cuenta:", error);
        return [];
    }
}

export const deleteCuenta = async (cuenta_id) => {
    try {
        let rsp = await DELETE(`/controller/cuentas/${cuenta_id}`);
        return rsp || {};
    } catch (error) {
        console.error("Error en la solicitud DELETE en cuenta:", error);
        return {};
    }
}