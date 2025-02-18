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

    const [errores, setErrores] = useState({
        nuevoNombre: "",
        nuevoCorreo: "",
        nuevaContraseña: "",
        confirmarContraseña: "",
        general: ""
    });
    const [success, setSuccess] = useState(false);

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

    const validarFormularioEdicion = () => {
        const nuevoErrores = {
            nuevoNombre: "",
            nuevoCorreo: "",
            general: ""
        };

        let esValido = true;

        // Validar campos vacíos
        if (!formData.nuevoNombre.trim() || !formData.nuevoCorreo.trim()) {
            nuevoErrores.general = "Todos los campos son obligatorios";
            esValido = false;
        }

        // Validar longitud del nombre de usuario
        if (formData.nuevoNombre.trim().length < 3 || formData.nuevoNombre.trim().length > 20) {
            nuevoErrores.nuevoNombre = "El nombre de usuario debe tener entre 3 y 20 caracteres";
            esValido = false;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.nuevoCorreo.trim())) {
            nuevoErrores.nuevoCorreo = "El formato del correo electrónico no es válido";
            esValido = false;
        }

        setErrores(prev => ({ ...prev, ...nuevoErrores }));
        return esValido;
    };

    const validarFormularioContraseña = () => {
        const nuevoErrores = {
            nuevaContraseña: "",
            confirmarContraseña: "",
            general: ""
        };

        let esValido = true;

        // Validar campos vacíos
        if (!formData.nuevaContraseña || !formData.confirmarContraseña) {
            nuevoErrores.general = "Todos los campos son obligatorios";
            esValido = false;
        }

        // Validar contraseña
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(formData.nuevaContraseña)) {
            nuevoErrores.nuevaContraseña = "La contraseña debe tener al menos 8 caracteres, incluyendo letras y números";
            esValido = false;
        }

        // Validar que las contraseñas coincidan
        if (formData.nuevaContraseña !== formData.confirmarContraseña) {
            nuevoErrores.confirmarContraseña = "Las contraseñas no coinciden";
            esValido = false;
        }

        setErrores(prev => ({ ...prev, ...nuevoErrores }));
        return esValido;
    };

    const handleModalToggle = useCallback((modalName, value) => {
        setModals(prev => ({ ...prev, [modalName]: value }));
        // Resetear errores y form data cuando se cierra el modal
        if (!value) {
            setErrores({
                nuevoNombre: "",
                nuevoCorreo: "",
                nuevaContraseña: "",
                confirmarContraseña: "",
                general: ""
            });
            setFormData(prev => ({
                ...prev,
                nuevaContraseña: "",
                confirmarContraseña: ""
            }));
        }
    }, []);

    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Limpiar error específico del campo
        setErrores(prev => ({ ...prev, [field]: "", general: "" }));
    }, []);

    const guardarCambios = useCallback(async () => {
        try {
            setErrores({
                nuevoNombre: "",
                nuevoCorreo: "",
                general: ""
            });

            if (!validarFormularioEdicion()) {
                return;
            }

            // Verificar si realmente hay cambios
            if (formData.nuevoNombre === usuario.usuario &&
                formData.nuevoCorreo === usuario.email) {
                handleModalToggle('editando', false);
                return;
            }

            const data = {
                usuario: formData.nuevoNombre.trim(),
                email: formData.nuevoCorreo.trim()
            };

            const respuesta = await updateUsuario(info?.usuario_id, data);

            if (respuesta.token) {
                setSuccess(true);
                setUsuario(prev => ({
                    ...prev,
                    usuario: data.usuario,
                    email: data.email
                }));

                localStorage.setItem("token", respuesta.token);

                setTimeout(() => {
                    setSuccess(false);
                    handleModalToggle('editando', false);
                }, 2000);
            }
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            setErrores(prev => ({
                ...prev,
                general: error.message || "Error al actualizar el perfil"
            }));
        }
    }, [formData, info?.usuario_id, handleModalToggle, usuario, validarFormularioEdicion]);

    const cambiarContraseña = useCallback(async () => {
        try {
            // Limpiar errores previos
            setErrores({
                nuevoNombre: "",
                nuevoCorreo: "",
                nuevaContraseña: "",
                confirmarContraseña: "",
                general: ""
            });

            // Validar formulario
            if (!validarFormularioContraseña()) {
                return;
            }

            const respuesta = await updateClave(info?.usuario_id, {
                clave: formData.nuevaContraseña
            });

            if (respuesta) {
                setSuccess(true);
                alert("Contraseña actualizada exitosamente");
                handleModalToggle('cambiandoContraseña', false);

                setTimeout(() => {
                    setSuccess(false);
                    alert("Se cerrará la sesión para aplicar los cambios");
                    localStorage.removeItem("token");
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            setErrores(prev => ({
                ...prev,
                general: "Error al actualizar la contraseña"
            }));
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
                        className="animated-button"
                        text="Editar Perfil"
                        onClick={() => handleModalToggle('editando', true)}
                    />
                    <ButtonForm
                        className="animated-button"
                        text="Cambiar Contraseña"
                        onClick={() => handleModalToggle('cambiandoContraseña', true)}
                    />
                </div>
            </div>

            <Modal isOpen={modals.editando} onClose={() => handleModalToggle('editando', false)} title="Editar Perfil" width="w-96">
                <div className="absolute left-0 top-5 cursor-pointer group">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                    </svg>

                    {/* Tooltip */}
                    <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 w-48 text-center left-1/2 transform -translate-x-1/2 top-full mt-1">
                        Si se realizan cambios, la próxima vez deberá iniciar sesión con los mismos.
                    </div>
                </div>
                <div className="space-y-4">
                    {errores.general && (
                        <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errores.general}</p>
                    )}
                    {success && (<p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">Informacion actualizada exitosamente</p>)}

                    <div>
                        <InputForm
                            type="text"
                            label="Nuevo Nombre"
                            onChange={(e) => handleInputChange('nuevoNombre', e.target.value)}
                            placeholder="Nuevo nombre"
                        />
                        {errores.nuevoNombre && (
                            <p className="text-red-600 text-sm mt-1">{errores.nuevoNombre}</p>
                        )}
                    </div>

                    <div>
                        <InputForm
                            type="email"
                            label="Nuevo Correo"
                            onChange={(e) => handleInputChange('nuevoCorreo', e.target.value)}
                            placeholder="Nuevo correo"
                        />
                        {errores.nuevoCorreo && (
                            <p className="text-red-600 text-sm mt-1">{errores.nuevoCorreo}</p>
                        )}
                    </div>

                    <div className="flex justify-between mt-4">
                        <ButtonForm
                            text="Cancelar"
                            className="button-cancelar"
                            onClick={() => handleModalToggle('editando', false)}
                        />
                        <ButtonForm
                            text="Guardar"
                            onClick={guardarCambios}
                        />
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
                    {errores.general && (
                        <p className="text-red-600 text-sm">{errores.general}</p>
                    )}

                    <div>
                        <InputForm
                            type="password"
                            label="Nueva Contraseña"
                            value={formData.nuevaContraseña}
                            onChange={(e) => handleInputChange('nuevaContraseña', e.target.value)}
                            placeholder="Nueva contraseña"
                        />
                        {errores.nuevaContraseña && (
                            <p className="text-red-600 text-sm mt-1">{errores.nuevaContraseña}</p>
                        )}
                    </div>

                    <div>
                        <InputForm
                            type="password"
                            label="Confirmar Contraseña"
                            value={formData.confirmarContraseña}
                            onChange={(e) => handleInputChange('confirmarContraseña', e.target.value)}
                            placeholder="Confirmar nueva contraseña"
                        />
                        {errores.confirmarContraseña && (
                            <p className="text-red-600 text-sm mt-1">{errores.confirmarContraseña}</p>
                        )}
                    </div>

                    <div className="flex justify-between mt-4">
                        <ButtonForm
                            text="Cancelar"
                            className="button-cancelar"
                            onClick={() => handleModalToggle('cambiandoContraseña', false)}
                        />
                        <ButtonForm
                            text="Guardar"
                            onClick={cambiarContraseña}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PerfilUsuario;