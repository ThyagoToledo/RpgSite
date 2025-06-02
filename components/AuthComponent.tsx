
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';
import Input from './ui/Input';
import { User } from '../types'; // Import User type

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);
const LockClosedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
</svg>
);


interface AuthComponentProps {
  mode: 'login' | 'register';
}

const AuthComponent: React.FC<AuthComponentProps> = ({ mode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const { login, register, isLoading, currentUser, addNotification } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.isAdmin ? '/admin' : '/shop');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'register' && password !== confirmPassword) {
      setError("As senhas não coincidem.");
      addNotification("As senhas não coincidem.", "error");
      return;
    }
    if (!username.trim() || !password.trim()){
      setError("Nome de usuário e senha não podem estar vazios.");
      addNotification("Nome de usuário e senha não podem estar vazios.", "error");
      return;
    }

    let loggedInUser: User | null = null;
    if (mode === 'login') {
      loggedInUser = await login(username, password);
    } else {
      loggedInUser = await register(username, password);
    }

    if (loggedInUser) {
      // navigate to admin if the loggedInUser is admin OR if the username is 'admin' and mode is 'login' (for initial admin login)
      // otherwise navigate to shop. This logic covers the case where currentUser might not be immediately updated after login/register.
      const isAdminUser = loggedInUser.isAdmin || (username === 'admin' && password === 'admin' && mode === 'login');
      navigate(isAdminUser ? '/admin' : '/shop'); 
    } else {
      // Error message is handled by addNotification in AuthContext
      // setError is mostly for local form validation like password mismatch
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-indigo-400">
            {mode === 'login' ? 'Entre na sua conta' : 'Crie uma nova conta'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nome de Usuário"
                label="Nome de Usuário"
                icon={<UserIcon className="h-5 w-5"/>}
              />
            </div>
            <div className="pt-4">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                label="Senha"
                icon={<LockClosedIcon className="h-5 w-5"/>}
              />
            </div>
            {mode === 'register' && (
              <div className="pt-4">
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmar Senha"
                  label="Confirmar Senha"
                  icon={<LockClosedIcon className="h-5 w-5"/>}
                />
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <div>
            <Button type="submit" className="w-full" isLoading={isLoading} variant="primary" size="lg">
              {mode === 'login' ? 'Entrar' : 'Registrar'}
            </Button>
          </div>
        </form>
        <div className="text-sm text-center">
          {mode === 'login' ? (
            <p className="text-gray-400">
              Não tem uma conta?{' '}
              <button onClick={() => navigate('/auth/register')} className="font-medium text-indigo-400 hover:text-indigo-300">
                Registre-se aqui
              </button>
            </p>
          ) : (
             <p className="text-gray-400">
              Já tem uma conta?{' '}
              <button onClick={() => navigate('/auth/login')} className="font-medium text-indigo-400 hover:text-indigo-300">
                Entre aqui
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
