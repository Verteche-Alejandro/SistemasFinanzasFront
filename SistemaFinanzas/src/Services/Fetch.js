const backendurl = 'http://localhost:8081';

export async function POST(url, data) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(backendurl + url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });


        if (!response.ok) {
            const errorData = await response.text();

            try {
                const jsonError = JSON.parse(errorData);
                throw { status: response.status, message: jsonError.message || errorData };
            } catch (e) {

                throw { status: response.status, message: errorData };
            }
        }


        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (error) {
        if (error.message) {
            throw error;
        }
        throw { status: 500, message: "Error de conexión con el servidor" };
    }
}



export async function GET(url) {
    return await fetch(backendurl + url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((res) => res.json())
        .then((res) => res)
        .catch((err) => console.log("Error en la solicitud GET desde fetch", err));
}

export async function GETBYID(url) {
    const token = localStorage.getItem('token');
    const finalUrl = `${backendurl}${url}`;

    console.log("URL final:", finalUrl);

    return await fetch(finalUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then((res) => res.json())
        .then((res) => res)
        .catch((err) => console.log("Error en la solicitud GETBYID en fetch", err));
}

export async function PATCH(url, data) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("Error: No se encontró el token en localStorage.");
        throw { status: 401, message: "No autorizado. Debe iniciar sesión." };
    }

    try {
        const response = await fetch(backendurl + url, {
            method: 'PATCH',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });


        const responseData = await response.json();


        if (!response.ok) {
            throw {
                status: response.status,
                message: responseData.message || 'No se pudo actualizar'
            };
        }

        return responseData;
    } catch (error) {
        console.error("Error en PATCH:", error);
        throw error;
    }
}

export async function DELETE(url, data) {
    const objString = '?' + new URLSearchParams(data).toString();

    return await fetch(backendurl + url + objString, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    })
        .then((res) => res.json())
        .then((res) => res)
        .catch((err) => console.log(err));
}