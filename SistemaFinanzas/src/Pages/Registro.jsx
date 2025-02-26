import Form from "../Layouts/Form"
import InputForm from "../Components/Inputs/InputForm";
import ButtonForm from "../Components/Buttons/ButtonForm";
import { Registro } from "../Services/Auth";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackIcon from "../Assets/Icons/BackIcon";

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

        if (!dataToValidate.usuario || !dataToValidate.email || !dataToValidate.confirmarEmail ||
            !dataToValidate.clave || !dataToValidate.confirmarClave) {
            nuevoErrores.general = "Todos los campos son obligatorios";
            if (mostrarError) setErrores(nuevoErrores);
            return false;
        }

        if (dataToValidate.usuario.length < 3 || dataToValidate.usuario.length > 20) {
            nuevoErrores.usuario = "El nombre de usuario debe tener entre 3 y 20 caracteres";
        }

        if (/^\d+$/.test(dataToValidate.usuario)) {
            nuevoErrores.usuario = "El nombre de usuario no puede contener solo números";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(dataToValidate.email)) {
            nuevoErrores.email = "El formato del correo electrónico no es válido";
        }

        if (dataToValidate.email !== dataToValidate.confirmarEmail) {
            nuevoErrores.confirmarEmail = "Los correos electrónicos no coinciden";
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(dataToValidate.clave)) {
            nuevoErrores.clave = "La contraseña debe tener al menos 8 caracteres, incluyendo letras y números";
        }

        if (dataToValidate.clave !== dataToValidate.confirmarClave) {
            nuevoErrores.confirmarClave = "Las contraseñas no coinciden";
        }

        const hayErrores = Object.values(nuevoErrores).some(error => error !== "");

        if (mostrarError) {
            setErrores(nuevoErrores);
        }

        return !hayErrores;
    };

    const Registrar = async (e) => {
        e.preventDefault();
        try {
            setErrores({
                general: "",
                usuario: "",
                email: "",
                confirmarEmail: "",
                clave: "",
                confirmarClave: ""
            });

            if (!validarFormulario()) {
                return;
            }

           
            const datosRegistro = {
                usuario: data.usuario.trim(),
                email: data.email.trim(),
                clave: data.clave
            };

            const rsp = await Registro(datosRegistro);

            if (rsp?.message === "Usuario registrado exitosamente") {
                alert("Usuario registrado correctamente, será redirigido al login");
                navigate("/login");
            }
        } catch (error) {
            console.log("Error en registro:", error);

            const errorMessage = error.message;

            if (errorMessage.includes("usuario ya está en uso")) {
                setErrores(prev => ({
                    ...prev,
                    usuario: "El nombre de usuario ya está en uso, por favor elija otro."
                }));
            } else if (errorMessage.includes("correo electrónico ya está registrado")) {
                setErrores(prev => ({
                    ...prev,
                    email: "El correo electrónico ya está registrado, por favor elija otro."
                }));
            } else {
                setErrores(prev => ({
                    ...prev,
                    general: errorMessage || "Error al intentar registrar el usuario"
                }));
            }
        }
    };

    const handleInputChange = useCallback((field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
        if (errores[field]) {
            setErrores(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    }, [errores]);

    const handleOnClick = (ruta) => {
        if (!ruta) return;
        navigate(ruta);
    }

    return (
        <div className="flex items-center justify-center rounded-xl p-6 h-[90vh] w-[55vw] mx-auto inset-0 
                        bg-gradient-to-br from-[#f0fbfb] to-[#d8f4f5] bg-opacity-40 backdrop-blur-3xl 
                        shadow-2xl border border-white/20">
            <div className="w-[50vw]">
                <h1 className="text-3xl font-bold mb-8 text-center 
                               bg-clip-text text-transparent bg-gradient-to-r from-[#2da0ad] to-[#49bdc7]">
                    Registro de Usuario
                </h1>
                <Form onSubmit={(e) => e.preventDefault()} className="px-4">
                    {errores.general && (
                        <p className="text-red-600 mb-6 text-center bg-[#f0fbfb] py-2 px-4 rounded-lg">
                            {errores.general}
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-8">
                        {/* Primera columna */}
                        <div className="space-y-6">
                            <div>
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

                            <div>
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

                            <div>
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
                        </div>

                        {/* Segunda columna */}
                        <div className="space-y-6">
                            <div>
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

                            <div>
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
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="mt-10 flex flex-col items-center space-y-5">
                        <ButtonForm
                            text={"Registrarse"}
                            onClick={Registrar}
                            className="w-full max-w-xs bg-[#2da0ad] hover:bg-[#288292] 
                                     transform hover:scale-105 transition-all duration-200 text-white">
                        </ButtonForm>
                        <button
                            onClick={() => handleOnClick("/login")}
                            className="flex items-center gap-3 text-[#276a77] hover:text-[#133039] 
                                       transition-all duration-200 ease-in-out py-2 px-4 rounded-lg">
                            <BackIcon />
                            <span className="font-semibold">Volver</span>
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default RegistroUsuario;