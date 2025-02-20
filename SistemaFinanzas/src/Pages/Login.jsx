import Form from "../Layouts/Form"
import InputForm from "../Components/Inputs/InputForm"
import ButtonForm from "../Components/Buttons/ButtonForm"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../Services/Auth"
import UserIcon from "../Assets/Icons/UserIcon"
import PadlockIcon from "../Assets/Icons/PadlockIcon"
import InfoIcon from "../Assets/Icons/InfoIcon"

const Login = () => {
    const [data, setData] = useState({ login: "", clave: "" });
    const [errores, setErrores] = useState("");
    const navigate = useNavigate();

    const Login = async () => {
        const rsp = await login(data);
        console.log("Respuesta :", rsp);
        if (rsp && rsp.token) {
            localStorage.setItem("token", rsp.token);
            console.log("Token guardado", rsp.token);
            navigate("/principal");
        } else {
            setErrores("Usuario o Contraseña incorrectos");
            navigate("/login");
        }
    }

    return (
        <>
            <div className="flex items-center justify-center rounded-lg p-4 h-[50vh] w-[30vw] mx-auto inset-0 bg-gradient-to-br from-[#f0fbfb] to-[#d8f4f5] bg-opacity-40 backdrop-blur-3xl 
                        shadow-2xl border border-white/20">
                <div className="w-[20vw] p-10 ">
                    <h1 className="text-3xl font-bold mb-8 text-center 
                               bg-clip-text text-transparent bg-gradient-to-r from-[#2da0ad] to-[#49bdc7]">Iniciar Sesion</h1>
                    <Form>
                        <div className="relative w-full">
                            <InputForm
                                placeHolder={"Usuario"}
                                onChange={(e) => { setData({ ...data, login: e.target.value }) }}
                                icono={<UserIcon />} />

                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer group">
                                <InfoIcon />
                                {/* Tooltip */}
                                <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 -top-8 left-0 w-40 text-center">
                                    Este campo puede ser su nombre de usuario o correo electrónico
                                </div>
                            </div>
                        </div>


                        <InputForm
                            type={"password"} placeHolder={"Contraseña"}
                            onChange={(e) => { setData({ ...data, clave: e.target.value }) }}
                            icono={<PadlockIcon />}
                        />
                        <ButtonForm className="w-full max-w-xs bg-[#2da0ad] hover:bg-[#288292] 
                                     transform hover:scale-105 transition-all duration-200 text-white" text={"Acceder"} type={"button"} onClick={Login} />
                        {errores && (<p className="text-red-500 text-center font-semibold">{errores}</p>)}
                    </Form>
                </div>
            </div >
            <div className="text-center mt-4">
                <hr className="border-gray-300 my-2" />
                <p className="text-sm text-white">
                    No tienes una cuenta?{" "}
                    <a href="/registro" className="font-bold hover:underline">
                        Registrate aqui
                    </a>
                </p>
            </div>
        </>

    )
}
export default Login