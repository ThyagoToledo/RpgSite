import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';

// Heroicon components (inline SVG for simplicity, normally import from library)
const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const ArrowRightOnRectangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
</svg>
);

const CogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m18 0h-1.5m-15.036-7.026A7.5 7.5 0 0 0 4.5 12H3m1.504-4.504L4.5 12m0 0v1.5m15-1.5v-1.5m0 0A7.5 7.5 0 0 0 19.5 12H21m-1.504 4.504L19.5 12m0 0v-1.5m-15.036 7.026A7.5 7.5 0 0 1 4.5 12H3m1.504 4.504L4.5 12m0 0v-1.5" />
  </svg>
);


const Navbar: React.FC = () => {
  const { currentUser, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-400 hover:text-indigo-300">
              Loja de Tokens RPG
            </Link>
            <div className="hidden md:block ml-10">
              <Link to="/shop" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Loja
              </Link>
              {currentUser?.isAdmin && (
                <Link to="/admin" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Painel do Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {isLoading ? (
              <div className="text-sm text-gray-400">Carregando...</div>
            ) : currentUser ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-300 flex items-center">
                  <UserCircleIcon className="w-5 h-5 mr-1 text-indigo-400" />
                  {currentUser.username}
                </span>
                <span className="text-sm font-semibold text-yellow-400">
                  {currentUser.tokens} Tokens
                </span>
                <Button onClick={handleLogout} variant="secondary" size="sm" icon={<ArrowRightOnRectangleIcon className="w-4 h-4"/>}>
                  Sair
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Button onClick={() => navigate('/auth/login')} variant="primary" size="sm">Entrar</Button>
                <Button onClick={() => navigate('/auth/register')} variant="ghost" size="sm">Registrar</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;