import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Sidebar({ logo, links, children }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <>
            {/* Sidebar */}
            <div
                className={`bg-gray-800 text-white w-64 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } fixed inset-y-0 left-0 z-40 lg:translate-x-0`}
            >
                {/* Logo */}
                <div className="p-4 text-xl font-bold border-b border-gray-700">
                    {logo}
                </div>
                {/* Links */}
                <nav className="flex-1 p-4 space-y-4">
                    {links.map((link, index) => (
                        <a
                            key={index}
                            href={link.path}
                            className="block py-2 px-4 rounded hover:bg-gray-700"
                        >
                            {link.text}
                        </a>
                    ))}
                </nav>
                {/* Footer */}
                <div className="flex justify-center p-4">
                    <button
                        onClick={cerrarSesion}
                        className="block text-sm text-gray-400 hover:underline"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>

            <button
                className="lg:hidden p-4 text-gray-800 bg-gray-200 fixed top-4 left-4 z-50 rounded focus:outline-none focus:ring" onClick={toggleSidebar}>
                ☰
            </button>
        </>
    );
}

export default Sidebar;
