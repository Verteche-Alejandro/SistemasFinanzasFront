const backendurl = 'http://localhost:8081';

export async function POST(url, data) {
    const token = localStorage.getItem('token');
    console.log("Token JWT:", token);  // Verificar que el token no esté vacío

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

        console.log("Código de estado HTTP:", response.status);

        // Si la respuesta no es exitosa, retorna un error con el mensaje del servidor
        if (!response.ok) {
            let errorMsg = "Error en la solicitud";
            try {
                const errorData = await response.json();
                errorMsg = errorData.message || response.statusText;
            } catch (e) {
                errorMsg = response.statusText; // Si la respuesta no es JSON, usa el texto de estado
            }
            console.log("Error en la solicitud POST:", errorMsg);
            return { error: errorMsg };
        }

        // Si la respuesta es un 204 (No Content), retorna un mensaje manualmente
        if (response.status === 204) {
            console.log("El servidor devolvió 204 No Content.");
            return { message: "Operación exitosa" };
        }

        // Intentar convertir la respuesta en JSON
        const jsonResponse = await response.json();
        console.log("Respuesta JSON del servidor:", jsonResponse);
        return jsonResponse;
    } catch (error) {
        console.log("Error en la solicitud POST en catch:", error);
        return { error: "Error de conexión con el servidor" };
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
    return await fetch(backendurl + url, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
    })
        .then((res) => res.json())
        .then((res) => res)
        .catch((err) => console.log(err));
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