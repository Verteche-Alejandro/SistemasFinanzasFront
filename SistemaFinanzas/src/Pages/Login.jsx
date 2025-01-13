import Form from "../Layouts/Form"
import InputForm from "../Components/Inputs/InputForm"
import ButtonForm from "../Components/Buttons/ButtonForm"

const Login = () => {
    return (
        <>
            <div className="flex border border-gray-300 rounded-lg p-4 mix-h-screen max-w-screen mx-auto inset-0 bg-white bg-opacity-40 backdrop-blur-3xl">
                <div className="w-full p-10 ">
                    <h1>Iniciar Sesion</h1>
                    <Form>
                        <InputForm placeHolder={"Usuario"} />
                        <InputForm placeHolder={"Contraseña"} />
                        <ButtonForm text={"Acceder"} type={"submit"} />
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