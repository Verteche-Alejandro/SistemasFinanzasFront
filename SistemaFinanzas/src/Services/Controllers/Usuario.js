import { GETBYID, PATCH } from '../Fetch';

export const getUsuarioById = async (usuario_id) => {
    try {
        let rsp = await GETBYID(`/controller/usuarios/${usuario_id}`);
        return rsp || {};
    } catch (error) {
        console.error("Error en la solicitud GET en usuario:", error);
        return {};
    }
};

export const updateUsuario = async (usuario_id, data) => {
    try {
        let rsp = await PATCH(`/controller/usuarios/${usuario_id}`, data);
        return rsp || {};
    } catch (error) {
        console.error("Error en la solicitud PUT en usuario:", error);
        return {};
    }
}

export const updateClave = async (usuario_id, clave) => {
    try {
        let rsp = await PATCH(`/controller/usuarios/actualizar-clave/${usuario_id}`, clave);
        return rsp || {};
    } catch (error) {
        console.error("Error en la solicitud PUT en usuario:", error);
        return {};
    }
}