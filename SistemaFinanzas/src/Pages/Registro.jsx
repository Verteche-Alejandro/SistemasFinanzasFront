import Form from "../Layouts/Form"
import InputForm from "../Components/Inputs/InputForm";
import ButtonForm from "../Components/Buttons/ButtonForm";
import { Registro } from "../Services/Auth";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

const RegistroUsuario = () => {
    const [data, setData] = useState({ usuario: "", email: "", confirmarEmail: "", clave: "", confirmarClave: "" });
    const [errores, setErrores] = useState({
        general: "",
        usuario: "",
        email: "",
        confirmarEmail: "",
        clave: "",
        confirmarClave: ""
    });
    const navigate = useNavigate();

    const validarFormulario = (dataToValidate = data, mostrarError = true) => {
        const nuevoErrores = {
            general: "",
            usuario: "",
            email: "",
            confirmarEmail: "",
            clave: "",
            confirmarClave: ""
        };

        // Validar campos vacíos
        if (!dataToValidate.usuario || !dataToValidate.email || !dataToValidate.confirmarEmail ||
            !dataToValidate.clave || !dataToValidate.confirmarClave) {
            nuevoErrores.general = "Todos los campos son obligatorios";
            if (mostrarError) setErrores(nuevoErrores);
            return false;
        }

        // Validar longitud del nombre de usuario
        if (dataToValidate.usuario.length < 3 || dataToValidate.usuario.length > 20) {
            nuevoErrores.usuario = "El nombre de usuario debe tener entre 3 y 20 caracteres";
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(dataToValidate.email)) {
            nuevoErrores.email = "El formato del correo electrónico no es válido";
        }

        // Validar que los emails coincidan
        if (dataToValidate.email !== dataToValidate.confirmarEmail) {
            nuevoErrores.confirmarEmail = "Los correos electrónicos no coinciden";
        }

        // Validar contraseña
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(dataToValidate.clave)) {
            nuevoErrores.clave = "La contraseña debe tener al menos 8 caracteres, incluyendo letras y números";
        }

        // Validar que las contraseñas coincidan
        if (dataToValidate.clave !== dataToValidate.confirmarClave) {
            nuevoErrores.confirmarClave = "Las contraseñas no coinciden";
        }

        // Verificar si hay algún error
        const hayErrores = Object.values(nuevoErrores).some(error => error !== "");

        if (mostrarError) {
            setErrores(nuevoErrores);
        }

        return !hayErrores;
    };

    const Registrar = async (e) => {
        e.preventDefault();
        try {
            // Limpiar error previo
            setErrores({
                general: "",
                usuario: "",
                email: "",
                confirmarEmail: "",
                clave: "",
                confirmarClave: ""
            });

            // Validar formulario
            if (!validarFormulario()) {
                return;
            }

            // Preparar datos para enviar
            const datosRegistro = {
                usuario: data.usuario.trim(),
                email: data.email.trim(),
                clave: data.clave
            };

            const rsp = await Registro(datosRegistro);
            console.log("Respuesta del servidor:", rsp);

            if (rsp?.message) {
                alert("Usuario registrado correctamente");
                navigate("/login");
            } else {
                setErrores(prev => ({
                    ...prev,
                    general: rsp?.error || "No se pudo registrar el usuario"
                }));
            }
        } catch (error) {
            console.error("Error en el registro:", error);
            // Manejar diferentes tipos de errores
            if (error.rsp?.data) {
                setErrores(prev => ({
                    ...prev,
                    general: error.rsp.data
                }));
            } else {
                setErrores(prev => ({
                    ...prev,
                    general: "Error al intentar registrar el usuario"
                }));
            }
        }
    };

    const handleInputChange = useCallback((field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
        // Limpiar solo el error específico del campo
        if (errores[field]) {
            setErrores(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    }, [errores]);

    return (
        <div className="flex items-center justify-center rounded-lg p-4 h-[90vh] w-[30vw] mx-auto inset-0 bg-white bg-opacity-40 backdrop-blur-3xl shadow-2xl">
            <div className="w-[20vw]">
                <h1>Registro de nuevo usuario</h1>
                <Form onSubmit={(e) => e.preventDefault()}>
                    {errores.general && (
                        <p className="text-red-600 mb-4">{errores.general}</p>
                    )}

                    <div className="mb-4">
                        <InputForm
                            onChange={(e) => handleInputChange("usuario", e.target.value)}
                            type="text"
                            label="Nombre"
                            placeHolder="Ingrese un nombre de usuario"
                            value={data.usuario}
                        />
                        {errores.usuario && (
                            <p className="text-red-600 text-sm mt-1">{errores.usuario}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <InputForm
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            type="email"
                            label="Correo"
                            placeHolder="Ingrese un correo electrónico"
                            value={data.email}
                        />
                        {errores.email && (
                            <p className="text-red-600 text-sm mt-1">{errores.email}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <InputForm
                            onChange={(e) => handleInputChange("confirmarEmail", e.target.value)}
                            type="email"
                            label="Confirmar Correo"
                            placeHolder="Repetir correo electrónico"
                            value={data.confirmarEmail}
                        />
                        {errores.confirmarEmail && (
                            <p className="text-red-600 text-sm mt-1">{errores.confirmarEmail}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <InputForm
                            onChange={(e) => handleInputChange("clave", e.target.value)}
                            type="password"
                            label="Contraseña"
                            placeHolder="Ingrese una contraseña"
                            value={data.clave}
                        />
                        {errores.clave && (
                            <p className="text-red-600 text-sm mt-1">{errores.clave}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <InputForm
                            onChange={(e) => handleInputChange("confirmarClave", e.target.value)}
                            type="password"
                            label="Confirmar Contraseña"
                            placeHolder="Repetir contraseña"
                            value={data.confirmarClave}
                        />
                        {errores.confirmarClave && (
                            <p className="text-red-600 text-sm mt-1">{errores.confirmarClave}</p>
                        )}
                    </div>

                    <div>
                        <ButtonForm text={"Registrarse"} onClick={Registrar}>
                            Registrarse
                        </ButtonForm>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default RegistroUsuario;