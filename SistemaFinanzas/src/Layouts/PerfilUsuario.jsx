import { useState, useEffect, useCallback } from "react";
import { updateUsuario, updateClave } from "../Services/Controllers/Usuario";
import Modal from "../Components/Modals/Modal";
import InputForm from "../Components/Inputs/InputForm";
import ButtonForm from "../Components/Buttons/ButtonForm";
import userImg from "../Assets/Img/user.png";

const PerfilUsuario = ({ info }) => {
    const [usuario, setUsuario] = useState({
        usuario: "Nombre de Usuario",
        email: "email@email.com",
        clave: "",
        foto: userImg,
    });

    const [modals, setModals] = useState({
        editando: false,
        cambiandoContraseña: false
    });

    const [formData, setFormData] = useState({
        nuevoNombre: "",
        nuevoCorreo: "",
        nuevaContraseña: "",
        confirmarContraseña: ""
    });

    // Actualizar estado cuando cambia info
    useEffect(() => {
        if (info) {
            const userData = {
                usuario: info.usuario || "Nombre de Usuario",
                email: info.email || "email@email.com",
                clave: info.clave || "",
                foto: info.foto || userImg,
            };
            setUsuario(userData);
            setFormData({
                nuevoNombre: userData.usuario,
                nuevoCorreo: userData.email,
                nuevaContraseña: "",
                confirmarContraseña: ""
            });
        }
    }, [info]);

    const handleModalToggle = useCallback((modalName, value) => {
        setModals(prev => ({ ...prev, [modalName]: value }));
        // Resetear form data cuando se cierra el modal
        if (!value) {
            setFormData(prev => ({
                ...prev,
                nuevaContraseña: "",
                confirmarContraseña: ""
            }));
        }
    }, []);

    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const guardarCambios = useCallback(async () => {
        const { nuevoNombre, nuevoCorreo } = formData;

        // Validaciones
        if (!nuevoNombre.trim() || !nuevoCorreo.trim()) {
            alert("Nombre y correo son requeridos");
            return;
        }

        try {
            const data = {
                usuario: nuevoNombre.trim(),
                email: nuevoCorreo.trim(),
            };

            const respuesta = await updateUsuario(info?.usuario_id || 1, data);

            if (respuesta) {
                setUsuario(prev => ({ ...prev, ...data }));
                handleModalToggle('editando', false);
            }
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            alert("Error al actualizar el perfil");
        }
    }, [formData, info?.usuario_id, handleModalToggle]);

    const cambiarContraseña = useCallback(async () => {
        const { nuevaContraseña, confirmarContraseña } = formData;

        // Validaciones
        if (!nuevaContraseña || !confirmarContraseña) {
            alert("Ambos campos de contraseña son requeridos");
            return;
        }

        if (nuevaContraseña !== confirmarContraseña) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            const respuesta = await updateClave(info?.usuario_id || 1, {
                clave: nuevaContraseña
            });

            if (respuesta) {
                alert("Contraseña actualizada exitosamente");
                handleModalToggle('cambiandoContraseña', false);

                // Cerrar sesión después de un breve delay
                setTimeout(() => {
                    alert("Se cerrara la sesion para aplicar los cambios");
                    localStorage.removeItem("token");
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            alert("Error al actualizar la contraseña");
        }
    }, [formData, info?.usuario_id, handleModalToggle]);

    return (
        <div className="h-[50vh] bg-white shadow-lg rounded-lg p-6 mt-10">
            <div className="w-full h-full flex flex-col items-center justify-center">
                <img
                    src={usuario.foto}
                    alt="Foto de perfil"
                    className="w-60 h-60 rounded-full border-2 border-gray-300 transition-transform hover:scale-105"
                    onError={(e) => { e.target.src = userImg }}
                />
                <h2 className="text-3xl font-semibold mt-3 text-gray-800">{usuario.usuario}</h2>
                <p className="text-xl text-gray-600 mb-3">{usuario.email}</p>

                <div className="flex gap-4 mt-4">
                    <ButtonForm
                        text="Editar Perfil"
                        onClick={() => handleModalToggle('editando', true)}
                    />
                    <ButtonForm
                        text="Cambiar Contraseña"
                        onClick={() => handleModalToggle('cambiandoContraseña', true)}
                    />
                </div>
            </div>

            <Modal
                isOpen={modals.editando}
                onClose={() => handleModalToggle('editando', false)}
                title="Editar Perfil"
                width="w-96"
            >
                <div className="space-y-4">
                    <InputForm
                        type="text"
                        label="Nuevo Nombre"
                        value={formData.nuevoNombre}
                        onChange={(e) => handleInputChange('nuevoNombre', e.target.value)}
                        placeholder="Nuevo nombre"
                    />
                    <InputForm
                        type="email"
                        label="Nuevo Correo"
                        value={formData.nuevoCorreo}
                        onChange={(e) => handleInputChange('nuevoCorreo', e.target.value)}
                        placeholder="Nuevo correo"
                    />
                    <div className="flex justify-between mt-4">
                        <button
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                            onClick={() => handleModalToggle('editando', false)}
                        >
                            Cancelar
                        </button>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                            onClick={guardarCambios}
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={modals.cambiandoContraseña}
                onClose={() => handleModalToggle('cambiandoContraseña', false)}
                title="Cambiar Contraseña"
                width="w-96"
            >
                <div className="space-y-4">
                    <InputForm
                        type="password"
                        label="Nueva Contraseña"
                        value={formData.nuevaContraseña}
                        onChange={(e) => handleInputChange('nuevaContraseña', e.target.value)}
                        placeholder="Nueva contraseña"
                    />
                    <InputForm
                        type="password"
                        label="Confirmar Contraseña"
                        value={formData.confirmarContraseña}
                        onChange={(e) => handleInputChange('confirmarContraseña', e.target.value)}
                        placeholder="Confirmar nueva contraseña"
                    />
                    <div className="flex justify-between mt-4">
                        <button
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                            onClick={() => handleModalToggle('cambiandoContraseña', false)}
                        >
                            Cancelar
                        </button>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
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