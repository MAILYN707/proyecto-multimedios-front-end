import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-sky-400 py-3 shadow-md w-full">
      <div className="w-full flex justify-between items-center px-6">
        <span className="text-white text-xl font-semibold">Biblioteca UCR</span>
        <ul className="flex space-x-6 text-white font-medium">
          <li>
            <Link to="/" className="hover:underline">Inicio</Link>
          </li>
          <li>
            <Link to="/autores" className="hover:underline">Autores</Link>
          </li>
          <li>
            <Link to="/libros" className="hover:underline">Libros</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
