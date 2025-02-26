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
        const response = await PATCH(`/controller/usuarios/${usuario_id}`, data);

        if (!response) {
            throw new Error("No se recibió respuesta del servidor");
        }

        return response;
    } catch (error) {
        console.error("Error en la solicitud PATCH en usuario:", error);

        if (error.status === 409) {
            throw {
                status: 409,
                message: "El usuario o correo electrónico ya está en uso"
            };
        }

        throw error;
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