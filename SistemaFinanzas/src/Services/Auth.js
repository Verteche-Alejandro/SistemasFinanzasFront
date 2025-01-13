import { POST } from './fetch';

export async function login(data) {
    try {
        const rsp = await POST('/auth/login',data);
        if (rsp) {
            return rsp;
        }
        else {
            console.log("Error en la solicitud login en Auth");
            return null;
        }
    } catch (error) {
        console.log("Error en la solicitud login en Auth", error);
    }
}