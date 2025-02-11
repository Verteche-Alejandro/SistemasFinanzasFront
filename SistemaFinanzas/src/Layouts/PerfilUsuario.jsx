import { useState, useEffect } from "react";
import Modal from "../Components/Modals/Modal";
import InputForm from "../Components/Inputs/InputForm";
import ButtonForm from "../Components/Buttons/ButtonForm";
import userImg from "../Assets/Img/user.png";
import { updateUsuario, updateClave } from "../Services/Controllers/Usuario";

const PerfilUsuario = ({ info }) => {
    const [usuario, setUsuario] = useState({
        usuario: "Nombre de Usuario",
        email: "email@email.com",
        clave: "",
        foto: userImg,
    });

    const [editando, setEditando] = useState(false); // Modal de editar perfil
    const [cambiandoContraseña, setCambiandoContraseña] = useState(false); // Modal de cambiar contraseña
    const [nuevoNombre, setNuevoNombre] = useState(usuario.usuario);
    const [nuevoCorreo, setNuevoCorreo] = useState(usuario.email);
    const [nuevaContraseña, setNuevaContraseña] = useState('');
    const [nuevaContraseñaFinal, setNuevaContraseñaFinal] = useState('');
    const [confirmarContraseñaFinal, setConfirmarContraseñaFinal] = useState('');

    // Si `info` cambia, actualiza el estado
    useEffect(() => {
        if (info) {
            setUsuario({
                usuario: info.usuario || "Nombre de Usuario",
                email: info.email || "email@email.com",
                clave: info.clave || "",
                foto: info.foto || userImg, // Si no tiene foto, usa la imagen por defecto
            });
        }
    }, [info]);

    useEffect(() => {
        setNuevoNombre(usuario.usuario);
        setNuevoCorreo(usuario.email);
        setNuevaContraseña(usuario.clave);
    }, [usuario]);

    const guardarCambios = async () => {
        // Si el nombre o el correo están vacíos, restauramos el valor original
        const nombreValido = nuevoNombre.trim() !== "" ? nuevoNombre : usuario.usuario;
        const correoValido = nuevoCorreo.trim() !== "" ? nuevoCorreo : usuario.email;

        // Preparar datos de usuario para actualizar
        const data = {
            usuario: nombreValido,
            email: correoValido,
            ...(nuevaContraseña.trim() && { clave: nuevaContraseña }), // Solo incluye la clave si es nueva
        };

        try {
            // Llamamos a la API para actualizar el perfil
            const respuesta = await updateUsuario(1, data); // Asegúrate de que el ID se pasa correctamente

            if (respuesta) {
                // Si la respuesta es exitosa, actualizamos el estado local
                setUsuario({ ...usuario, usuario: nombreValido, email: correoValido, clave: nuevaContraseña });
                setEditando(false); // Cerramos el modal
            } else {
                console.error("Error al actualizar el usuario");
            }
        } catch (error) {
            console.error("Error en guardarCambios:", error);
        }
    };

    const cambiarContraseña = async () => {
        if (!nuevaContraseñaFinal.trim() || !confirmarContraseñaFinal.trim()) {
            alert("Las contraseñas no pueden estar vacías.");
            return;
        }

        if (nuevaContraseñaFinal !== confirmarContraseñaFinal) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const data = { clave: nuevaContraseñaFinal };

        try {
            const respuesta = await updateClave(1, data);

            if (respuesta) {
                alert("Contraseña actualizada exitosamente.");
                setCambiandoContraseña(false);
                setUsuario(prevState => ({ ...prevState, clave: nuevaContraseñaFinal }));

                // Forzar cierre de sesión después del cambio de contraseña
                setTimeout(() => {
                    alert("Se cerrará la sesión para aplicar los cambios.");
                    localStorage.removeItem("token"); // Elimina el token almacenado
                    window.location.reload(); // Recarga la página
                }, 1000);
            } else {
                alert("Error al actualizar la contraseña.");
            }
        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
        }
    };


    return (
        <div className="h-[50vh] bg-white shadow-lg rounded-lg p-6 mt-10">
            <div className="w-full h-full flex flex-col items-center justify-center">
                <img
                    src={usuario.foto}
                    alt="Foto"
                    className="w-60 h-60 rounded-full border-2 border-gray-300 transition-all duration-300 ease-in-out transform hover:scale-105" // Transición y hover para la imagen
                    onError={(e) => (e.target.src = userImg)} // En caso de error, usa la imagen por defecto
                />
                <h2 className="text-3xl font-semibold mt-3 text-gray-800 transition-all duration-300 ease-in-out">{usuario.usuario}</h2>
                <p className="text-xl text-gray-600 mb-3 transition-all duration-300 ease-in-out">{usuario.email}</p>
                <div className="flex flex-row flex-wrap items-center justify-center mt-4 space-x-4">
                    <ButtonForm
                        text={"Editar Perfil"}
                        onClick={() => setEditando(true)}
                    />
                    <ButtonForm
                        text={"Cambiar Contraseña"}
                        onClick={() => setCambiandoContraseña(true)}
                    />
                </div>
            </div>

            {/* Modal para edición del perfil */}
            <Modal isOpen={editando} onClose={() => setEditando(false)} title="Editar Perfil" width="w-96">
                <div>
                    <InputForm
                        type={"text"}
                        label={"Nuevo Nombre"}
                        value={nuevoNombre}
                        onChange={(e) => setNuevoNombre(e.target.value)}
                        placeholder={"Nuevo nombre"}
                    />
                    <InputForm
                        type={"email"}
                        label={"Nuevo Correo"}
                        value={nuevoCorreo}
                        onChange={(e) => setNuevoCorreo(e.target.value)}
                        placeholder={"Nuevo correo"}
                    />

                    <div className="flex justify-between mt-4">
                        <button
                            className="bg-gray-400 text-white px-3 py-2 rounded"
                            onClick={() => setEditando(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                            onClick={guardarCambios}
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal para cambio de contraseña */}
            <Modal isOpen={cambiandoContraseña} onClose={() => setCambiandoContraseña(false)} title="Cambiar Contraseña" width="w-96">
                <div>
                    <InputForm
                        type="password"
                        label={"Nueva Contraseña"}
                        value={nuevaContraseñaFinal}
                        onChange={(e) => setNuevaContraseñaFinal(e.target.value)}
                        placeholder="Nueva contraseña"
                    />
                    <InputForm
                        type="password"
                        label={"Confirmar Contraseña"}
                        value={confirmarContraseñaFinal}
                        onChange={(e) => setConfirmarContraseñaFinal(e.target.value)}
                        placeholder="Confirmar nueva contraseña"
                    />

                    <div className="flex justify-between mt-4">
                        <button
                            className="bg-gray-400 text-white px-3 py-2 rounded"
                            onClick={() => setCambiandoContraseña(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                            onClick={cambiarContraseña}
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PerfilUsuario;
