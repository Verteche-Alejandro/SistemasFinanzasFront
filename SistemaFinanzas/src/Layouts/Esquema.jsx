import { useState } from 'react';
import Sidebar from "../Components/Sidebar/Sidebar";

const Esquema = ({ children }) => {
    const [links, setLinks] = useState([
        { text: "Inicio", path: "/principal" },
        { text: "Perfil", path: "/perfil" },
        { text: "Cuentas", path: "/cuentas" },
        { text: "Transacciones", path: "/transacciones" },
        { text: "Reportes", path: "/reportes" },
    ]);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <>
            <div className="flex items-center justify-center h-[93vh] w-full ">
                <div className="relative flex h-[90vh] w-[80vw] rounded-3xl shadow-lg overflow-hidden">
                    <Sidebar logo={"Gestión Finanzas Personales"} links={links} isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <div className="flex-1 flex flex-col items-center justify-center bg-white p-10">
                        <button className="absolute top-4 left-4 p-3 rounded-lg bg-gray-800 text-white md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)} >
                            &#9776; {/* Ícono hamburguesa */}
                        </button>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Esquema;