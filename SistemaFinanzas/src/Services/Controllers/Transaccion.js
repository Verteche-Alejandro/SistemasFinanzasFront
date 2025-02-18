import { POST, GETBYID, DELETE, GET } from '../Fetch';

export const getTransaccionesByCuenta = async (cuenta_id) => {
    try {
        let rsp = await GETBYID(`/controller/transacciones/cuenta/${cuenta_id}`);
        return rsp || [];
    } catch (error) {
        console.error("Error en la solicitud GET en transaccion:", error);
        return [];
    }
};

export const getAllTransacciones = async () => {
    try {
        let rsp = await GET("/controller/transacciones/alltransacciones");
        return rsp || [];
    } catch (error) {
        console.error("Error en la solicitud GET en transaccion:", error);
        return [];
    }
}

export const registrarTransaccion = async (data) => {
    try {
        let rsp = await POST('/controller/transacciones', data);
        if (rsp) {
            return rsp;
        } else {
            console.error("Error en la solicitud POST en Transaccion: respuesta vacía");
            return null;
        }
    } catch (error) {
        console.error("Error en la solicitud POST en catch de transaccion:", error);
    }
}

export const eliminarTransaccion = async (transac_id) => {
    try {
        let rsp = await DELETE(`/controller/transacciones/${transac_id}`);
        if (rsp) {
            return rsp;
        } else {
            console.error("Error en la solicitud DELETE en Transaccion: respuesta vacía");
            return null;
        }
    } catch (error) {
        console.error("Error en la solicitud DELETE en catch de transaccion:", error);
    }
}

export const buscarTransaccionPorAlias = async (alias) => {
    try {
        // Enviamos el alias en el formato correcto que espera el backend
        const data = {
            alias: alias
        };

        let rsp = await POST('/controller/transacciones/buscar-por-alias', data);

        // Si la respuesta es exitosa, retornamos los datos
        if (rsp) {
            return rsp;
        }

        return [];
    } catch (error) {
        console.error("Error en la búsqueda por alias:", error);
        // Si el error es 404 (no encontrado), retornamos array vacío
        if (error.status === 404) {
            return [];
        }
        throw error;
    }
};