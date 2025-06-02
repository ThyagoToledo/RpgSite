
import React, { createContext, useContext, ReactNode, useCallback, useState, useEffect } from 'react';
import { Item, ShopContextType, User } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const { currentUser, addNotification, fetchCurrentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true); // Loading for fetching initial items
  const [itemPurchaseState, setItemPurchaseState] = useState<{[itemId: string]: boolean}>({});


  const fetchShopItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedItems = await api.fetchItems();
      setItems(fetchedItems);
    } catch (error: any) {
      addNotification(error.message || 'Falha ao carregar itens da loja.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchShopItems();
  }, [fetchShopItems]);

  const addItem = useCallback(async (itemData: Omit<Item, 'id'>): Promise<Item | null> => {
    if (!currentUser?.isAdmin) {
      addNotification('Apenas administradores podem adicionar itens.', 'error');
      return null;
    }
    setIsLoading(true); // Can use a more specific loading state if preferred
    try {
      const newItem = await api.addItem(itemData);
      setItems(prevItems => [...prevItems, newItem]);
      addNotification('Item adicionado com sucesso!', 'success');
      return newItem;
    } catch (error: any) {
      addNotification(error.message || 'Falha ao adicionar item.', 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, addNotification]);

  const setPurchaseState = useCallback((itemId: string, isLoading: boolean) => {
    setItemPurchaseState(prev => ({ ...prev, [itemId]: isLoading }));
  }, []);

  const isPurchasing = useCallback((itemId: string): boolean => {
    return !!itemPurchaseState[itemId];
  }, [itemPurchaseState]);


  const purchaseItem = useCallback(async (itemId: string, userId: string): Promise<{ user: User; item: Item } | null> => {
    if (!currentUser || currentUser.id !== userId) {
      addNotification('Usuário inválido para compra.', 'error');
      return null;
    }
    setPurchaseState(itemId, true);
    try {
      const result = await api.purchaseItem(userId, itemId);
      if (result) {
        addNotification(`Comprou ${result.item.name} com sucesso!`, 'success');
        await fetchCurrentUser(); // Refresh current user's token info from AuthContext
        return result;
      }
      return null; // Should be caught by error handling
    } catch (error: any) {
      addNotification(error.message || 'Falha ao comprar item.', 'error');
      return null;
    } finally {
      setPurchaseState(itemId, false);
    }
  }, [currentUser, addNotification, fetchCurrentUser, setPurchaseState]);

  return (
    <ShopContext.Provider value={{ items, addItem, purchaseItem, isLoading, isPurchasing, setPurchaseState }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
