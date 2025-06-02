
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, AuthContextType, Notification, NotificationType } from '../types';
import { api } from '../services/api'; // Import the simulated API

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]); // For admin panel
  const [isLoading, setIsLoading] = useState(true); // General loading for session check
  const [isUserListLoading, setIsUserListLoading] = useState(false); // Specific for allUsers list
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: NotificationType) => {
    const newNotification: Notification = { id: Date.now().toString(), message, type };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 3000);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await api.getCurrentUserSession();
      setCurrentUser(user);
    } catch (error) {
      console.error("Erro ao buscar sessão do usuário:", error);
      setCurrentUser(null); // Ensure user is logged out on error
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const fetchAllUsersForAdmin = useCallback(async () => {
    if (currentUser?.isAdmin) {
      setIsUserListLoading(true);
      try {
        const users = await api.fetchAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.error("Erro ao buscar todos os usuários:", error);
        addNotification("Falha ao carregar lista de usuários.", "error");
      } finally {
        setIsUserListLoading(false);
      }
    } else {
      setAllUsers([]); // Clear if not admin
    }
  }, [addNotification, currentUser?.isAdmin]);


  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Fetch all users if current user is admin
  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchAllUsersForAdmin();
    } else {
      setAllUsers([]); // Clear user list if not admin or logged out
    }
  }, [currentUser, fetchAllUsersForAdmin]);


  const login = useCallback(async (username: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      const user = await api.login(username, password);
      if (user) {
        setCurrentUser(user);
        addNotification('Login bem-sucedido!', 'success');
        if (user.isAdmin) await fetchAllUsersForAdmin(); // Refresh user list for admin
        return user;
      } else {
        addNotification('Nome de usuário ou senha inválidos.', 'error');
        return null;
      }
    } catch (error: any) {
      addNotification(error.message || 'Falha no login.', 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [addNotification, fetchAllUsersForAdmin]);

  const register = useCallback(async (username: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      const newUser = await api.register(username, password);
      if (newUser) {
        setCurrentUser(newUser);
        addNotification('Registro bem-sucedido! Bem-vindo(a).', 'success');
        // No need to fetchAllUsersForAdmin here, new non-admin user won't change admin's view immediately unless refreshed
        return newUser;
      }
      return null; // Should be caught by error handling
    } catch (error: any) {
      addNotification(error.message || 'Falha no registro.', 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.logout();
      setCurrentUser(null);
      setAllUsers([]); // Clear user list on logout
      addNotification('Logout realizado com sucesso.', 'info');
    } catch (error: any) {
      addNotification(error.message || 'Falha no logout.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const addTokensToUser = useCallback(async (userId: string, amount: number): Promise<User | null> => {
    if (!currentUser?.isAdmin) {
      addNotification('Apenas administradores podem adicionar tokens.', 'error');
      return null;
    }
    setIsUserListLoading(true); // Indicate activity on the user list
    try {
      const updatedUser = await api.addTokensToUser(userId, amount);
      if (updatedUser) {
        setAllUsers(prevUsers => prevUsers.map(u => u.id === userId ? updatedUser : u));
        if (currentUser.id === userId) {
          setCurrentUser(updatedUser); // Update current admin's tokens if they added to themselves
        }
        addNotification(`Adicionados ${amount} tokens com sucesso.`, 'success');
        return updatedUser;
      }
      return null;
    } catch (error: any) {
      addNotification(error.message || 'Falha ao adicionar tokens.', 'error');
      return null;
    } finally {
      setIsUserListLoading(false);
    }
  }, [currentUser, addNotification]);


  return (
    <AuthContext.Provider value={{ 
        currentUser, 
        allUsers, 
        login, 
        register, 
        logout, 
        addTokensToUser, 
        isLoading, 
        isUserListLoading,
        fetchCurrentUser, 
        fetchAllUsersForAdmin,
        addNotification 
      }}>
      {children}
      {/* Notification Area */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`px-4 py-3 rounded-md shadow-lg text-white ${
              notif.type === 'success' ? 'bg-green-500' :
              notif.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`}
          >
            {notif.message}
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
