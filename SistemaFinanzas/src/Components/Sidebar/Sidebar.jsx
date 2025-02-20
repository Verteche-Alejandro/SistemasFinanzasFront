import { useNavigate } from "react-router-dom"
import BackIcon from "../../Assets/Icons/BackIcon"

function Sidebar({ logo, links, isOpen, toggleSidebar }) {
    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("cuentasUsuario");
        navigate("/login");
    };

    return (
        <div>
            {/* Overlay */}
            <div className={`fixed inset-0 bg-[#133039] opacity-30 z-30 ${isOpen ? 'block' : 'hidden'}`} onClick={toggleSidebar} />
            {/* Sidebar */}
            <div className={`fixed h-full flex flex-col bg-gradient-to-b from-[#254954] to-[#133039] 
                           text-[#f0fbfb] w-64 transform transition-transform duration-300 
                           inset-y-0 left-0 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                           md:translate-x-0 md:static md:inset-0`}>
                {/* Logo */}
                <div className="p-6 text-xl font-bold border-b border-[#276a77] bg-[#133039]/30">
                    <span className="bg-gradient-to-r from-[#49bdc7] to-[#83d7dd] text-transparent bg-clip-text">
                        {logo}
                    </span>
                </div>
                {/* Links */}
                <nav className="flex-1 p-4 space-y-2">
                    {links.map((link, index) => (
                        <a
                            key={index}
                            href={link.path}
                            className="block py-3 px-4 rounded-lg transition-all duration-200
                                        hover:bg-[#276a77]/30 hover:text-[#83d7dd]
                                        focus:bg-[#276a77]/50 focus:text-[#b5e8ec]
                                        active:bg-[#276a77]">
                            <div className="flex flex-row items-center justify-center gap-2"> {/* Aquí se agrega un flex para alinear el ícono y el texto */}
                                {link.icono}  {/* El ícono estará a la izquierda */}
                                {link.text}   {/* El texto a la derecha del ícono */}
                            </div>
                        </a>
                    ))}
                </nav>

                <div className="border-b border-[#276a77]"></div>
                {/* Footer */}
                <div className="p-6">
                    <button
                        onClick={cerrarSesion}
                        className="w-full py-2 px-4 rounded-lg text-[#b5e8ec] 
                                 transition-all duration-200
                                 hover:bg-[#254954] hover:text-[#d8f4f5]
                                 active:bg-[#133039]
                                 text-sm text-center">
                        <div className="flex items-center justify-center">
                            <BackIcon />
                            <span className="text-center ml-2">Cerrar sesión</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
