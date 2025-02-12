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

        if (rsp?.error) {
            console.error("Error en el registro:", rsp.error);
            return { error: rsp.error };
        }

        return rsp;
    } catch (error) {
        console.error("Error en la solicitud de registro en Auth:", error);
        return { error: "Error inesperado en el registro" };
    }
};
