import Esquema from "../Layouts/Esquema";

const Principal = () => {

    return (
        <>
            <Esquema>
                <h1 className="text-4xl font-bold text-gray-800">Bienvenido</h1>
                <p className="text-gray-500">Selecciona una opción del menú</p>
                <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
                    <div className="bg-blue-500 text-white rounded p-4 text-center">
                        <p className="text-2xl font-bold">Cuentas</p>
                        <p>Administra tus cuentas</p>
                    </div>
                    <div className="bg-green-500 text-white rounded p-4 text-center">
                        <p className="text-2xl font-bold">Movimientos</p>
                        <p>Registra tus movimientos</p>
                    </div>
                    <div className="bg-yellow-500 text-white rounded p-4 text-center">
                        <p className="text-2xl font-bold">Reportes</p>
                        <p>Genera reportes de tus finanzas</p>
                    </div>
                    <div className="bg-red-500 text-white rounded p-4 text-center">
                        <p className="text-2xl font-bold">Perfil</p>
                        <p>Actualiza tu perfil</p>
                    </div>
                </div>
            </Esquema>
        </>
    );
};
export default Principal;
