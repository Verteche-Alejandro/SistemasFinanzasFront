import Form from "../Layouts/Form"
import InputForm from "../Components/Inputs/InputForm"
import ButtonForm from "../Components/Buttons/ButtonForm"
import { useState} from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../Services/Auth"

const Login = () => {
    const [user, setUser] = useState("");
    const [data, setData] = useState({ usuario: "", clave: "" });
    const [errores, setErrores] = useState("");
    const navigate = useNavigate();

    const Login = async () => {
        const rsp = await login(data);
        if (rsp.token) {
            if (rsp.status === 200) {
                localStorage.setItem("token", rsp.token);
                navigate("/principal");
            } else {
                navigate("/login");
                setErrores(rsp.data.message);
            }
        } else {
            setErrores("Error en la solicitud");
        }
    }

    return (
        <>
            <div className="flex items-center justify-center rounded-lg p-4 h-[50vh] w-[30vw] mx-auto inset-0 bg-white bg-opacity-40 backdrop-blur-3xl shadow-2xl">
                <div className="w-[20vw] p-10 ">
                    <h1>Iniciar Sesion</h1>
                    <Form>
                        <div className="relative w-full mb-4">
                            <InputForm placeHolder={"Usuario"} onChange={(e) => { setData({ ...data, usuario: e.target.value }) }} icono={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            } />

                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer group">
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
                                <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 -top-8 left-0 w-40 text-center">
                                    Este campo puede ser su nombre de usuario o correo electrónico
                                </div>
                            </div>
                        </div>


                        <InputForm type={"password"} placeHolder={"Contraseña"} onChange={(e) => { setData({ ...data, clave: e.target.value }) }} icono={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                        } />
                        <ButtonForm text={"Acceder"} type={"button"} onClick={Login} />
                    </Form>
                </div>
            </div>
            <div className="text-center mt-4">
                <hr className="border-gray-300 my-2" />
                <p className="text-sm text-white">
                    No tienes una cuenta?{" "}
                    <a href="/register" className="font-bold hover:underline">
                        Registrate aqui
                    </a>
                </p>
            </div>
        </>

    )
}
export default Login