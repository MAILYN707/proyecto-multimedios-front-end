import logo from '../assets/LogoActualizado.png';

export function Home() {
    return (
        <div className="w-full h-screen flex flex-col">
            {/* Cuerpo gris con logo y texto */}
            <div className="bg-gray-300 flex-1 flex items-center justify-center">
                <div className="flex items-center">
                    <img
                        src={logo}
                        alt="Logo del sistema"
                        className="w-[120px] h-auto mr-6"
                    />
                    <h2 className="text-black text-2xl font-light leading-tight">
                        SISTEMA BIBLIOTECARIO<br />
                    </h2>
                </div>
            </div>
        </div>
    );
}
