import { useState, useEffect } from 'react';
import Sidebar from "../Components/Sidebar/Sidebar";
import HomeIcon from '../Assets/Icons/HomeIcon';
import UserIcon from '../Assets/Icons/UserIcon';
import AccountIcon from '../Assets/Icons/AccountIcon';
import MoneyIcon from '../Assets/Icons/MoneyIcon';
import ReportIcon from '../Assets/Icons/ReportIcon';

const Esquema = ({ children }) => {
    const [links, setLinks] = useState([
        { text: "Inicio", path: "/principal", icono: <HomeIcon /> },
        { text: "Perfil", path: "/perfil", icono: <UserIcon /> },
        { text: "Mis Cuentas", path: "/cuentas", icono: <AccountIcon /> },
        { text: "Gestionar Transacciones", path: "/transacciones", icono: <MoneyIcon /> },
        { text: "Generar Reportes", path: "/reportes", icono: <ReportIcon /> },
    ]);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="relative h-[93vh] w-full">

            <div className="flex items-center justify-center h-full w-full">
                <div className="relative flex h-[90vh] w-[80vw] rounded-3xl shadow-lg overflow-hidden">
                    <Sidebar
                        logo={"Gestión Finanzas Personales"}
                        links={links}
                        isOpen={sidebarOpen}
                        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    />
                    <div className="flex-1 flex flex-col items-center justify-center bg-white p-10">
                        <button
                            className="absolute top-4 left-4 p-3 rounded-lg bg-gray-800 text-white md:hidden"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            &#9776; {/* Ícono hamburguesa */}
                        </button>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Esquema;
