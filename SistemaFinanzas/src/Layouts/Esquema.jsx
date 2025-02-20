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
    const [time, setTime] = useState(new Date());

    // Actualiza el reloj cada segundo
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Formatea la hora en formato HH:MM sin AM/PM
    const formatTime = (date) => {
        const timeStr = date.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit', hour12: true });
        return timeStr.replace(/ [AP]M$/, '');
    };

    // Obtiene AM/PM en español
    const getAmPm = (date) => {
        const parts = date.toLocaleTimeString("es-ES", { hour12: true }).split(' ');
        return parts[1] || '';
    };

    // Obtiene el nombre del día en español (con la primera letra en mayúscula)
    const getWeekDay = (date) => {
        const weekday = date.toLocaleDateString("es-ES", { weekday: 'long' });
        return weekday.charAt(0).toUpperCase() + weekday.slice(1);
    };

    // Obtiene el número del día
    const getDayNumber = (date) => {
        return date.getDate();
    };

    return (
        <div className="relative h-[93vh] w-full">
            {/* Tarjeta de tiempo en la esquina superior derecha */}
            <div className="absolute top-4 right-4 z-10">
                <div className="card-time">
                    <span className="time-text">{formatTime(time)}</span>
                    <span className="day-text">{`${getWeekDay(time)} ${getDayNumber(time)}`}</span>
                    <div className="moon">🌙</div>
                </div>
            </div>

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
