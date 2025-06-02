import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthComponent from './components/AuthComponent';
import ShopDisplay from './components/ShopDisplay';
import AdminPanel from './components/AdminPanel';
import { useAuth } from './contexts/AuthContext';

const HomePage: React.FC = () => (
  <div className="text-center py-20 px-4">
    <h1 className="text-5xl font-bold text-indigo-400 mb-6">Bem-vindo à Loja de Tokens RPG!</h1>
    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
      Seu destino único para todas as necessidades de aventureiros. Navegue por nossos produtos, gerencie seus tokens e equipe-se para sua próxima missão!
    </p>
    <div className="space-x-4">
      <button onClick={() => window.location.hash = '#/shop'} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
        Visitar Loja
      </button>
      <button onClick={() => window.location.hash = '#/auth/login'} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
        Entrar / Registrar
      </button>
    </div>
     <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-indigo-300 mb-3">Vasta Seleção</h2>
            <p className="text-gray-400">Encontre de tudo, desde poções potentes até artefatos lendários.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-indigo-300 mb-3">Economia de Tokens</h2>
            <p className="text-gray-400">Ganhe e gaste tokens, a moeda universal dos aventureiros.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-indigo-300 mb-3">Poder do Admin</h2>
            <p className="text-gray-400">Lojistas podem gerenciar facilmente o inventário e as contas dos usuários.</p>
        </div>
    </div>
  </div>
);

const ProtectedRoute: React.FC<{ adminOnly?: boolean }> = ({ adminOnly = false }) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="text-xl text-indigo-300">Carregando status de autenticação...</div></div>; 
  }

  if (!currentUser) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !currentUser.isAdmin) {
    return <Navigate to="/shop" state={{ from: location }} replace />;
  }

  return <Outlet />;
};


const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Authentication routes */}
          <Route path="/auth/:mode" element={<AuthComponentWrapper />} />


          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/shop" element={<ShopDisplay />} />
          </Route>
          
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>

          {/* Fallback for any other path */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="bg-gray-800 text-center p-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Loja de Tokens RPG. Todos os direitos reservados.
      </footer>
    </div>
  );
};

// Wrapper component to pass mode prop correctly from URL param
const AuthComponentWrapper: React.FC = () => {
  const { mode } = useParams<{ mode: 'login' | 'register' }>();
  if (mode !== 'login' && mode !== 'register') {
    return <Navigate to="/auth/login" replace />; // Default to login if mode is invalid
  }
  return <AuthComponent mode={mode} />;
};


export default App;