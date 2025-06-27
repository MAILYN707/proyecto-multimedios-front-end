import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-[#2F8C8C] py-3 shadow-md w-full">
      <div className="w-full flex justify-between items-center px-6">
        <span className="text-white text-xl font-semibold">Gestión Biblioteca</span>
        <ul className="flex space-x-6 text-white font-medium">
          <li>
            <Link to="/" className="hover:underline">Inicio</Link>
          </li>
          <li>
            <Link to="/autores" className="hover:underline">Autores</Link>
          </li>
          <li>
            <Link to="/bibliotecario" className="hover:underline">Bibliotecario</Link>
          </li>

          <li>
            <Link to="/libro" className="hover:underline">Libros</Link>
          </li>

          <li>
            <Link to="/prestamo" className="hover:underline">Préstamo</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
