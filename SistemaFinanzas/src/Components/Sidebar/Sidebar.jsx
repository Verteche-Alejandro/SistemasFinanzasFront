import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Sidebar({ logo, links, isOpen, toggleSidebar }) {
    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div>
            {/* Overlay */}
            <div className={`fixed inset-0 bg-black opacity-50 z-30 ${isOpen ? 'block' : 'hidden'}`} onClick={toggleSidebar} />
            {/* Sidebar */}
            <div className={`fixed h-full flex flex-col bg-gray-800 text-white w-64 transform transition-transform duration-300 inset-y-0 left-0 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-0`}>
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
                            className="block py-2 px-4 rounded hover:bg-gray-700">
                            {link.text}
                        </a>
                    ))}
                </nav>
                <p className="border-b border-gray-700" ></p>
                {/* Footer */}
                <div className="flex justify-center p-4">
                    <button onClick={cerrarSesion} className="block text-sm text-gray-400 hover:underline">
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
