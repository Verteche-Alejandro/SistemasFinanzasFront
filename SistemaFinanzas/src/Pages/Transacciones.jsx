import { useState } from "react"
import Esquema from "../Layouts/Esquema"
import TableTransac from "../Layouts/TableTransac"
import NuevaTransac from "../Layouts/NuevaTransac";

const Transacciones = () => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <Esquema>
                <h1 className="text-4xl font-bold text-gray-800">Transacciones</h1>
                <p className="text-gray-500">Registra tus movimientos</p>
                <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
                    <div className="bg-blue-500 text-white rounded p-4 text-center">
                        <button onClick={() => setOpenModal(true)}>
                            <p className="text-2xl font-bold">Ingresos</p>
                            <p>Registra tus ingresos</p>
                        </button>
                    </div>
                    <div className="bg-green-500 text-white rounded p-4 text-center">
                        <p className="text-2xl font-bold">Egresos</p>
                        <p>Registra tus egresos</p>
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        <TableTransac />
                    </div>
                </div>
            </Esquema>

            <div>
                <NuevaTransac isOpen={openModal} onClose={()=>setOpenModal(false)} />
            </div>
        </>
    )
}

export default Transacciones