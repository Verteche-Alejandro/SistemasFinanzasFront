import { POST } from './fetch';

export const login = async (data) => {
    try {
        const rsp = await POST('/auth/login', data);
        return rsp ? rsp : null;
    } catch (error) {
        console.log("Error en la solicitud login en Auth", error);
    }
}

export const Registro = async (data) => {
    try {
        const rsp = await POST('/auth/register', data);
        return rsp ? rsp : console.log("Error en la solicitud de registro en Auth");
    } catch (error) {
        console.error("Error en la solicitud de registro en Auth:", error);
        throw error;
    }
};
