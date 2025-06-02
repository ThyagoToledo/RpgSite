
import { User, Item } from '../types';
import {
  LOCAL_STORAGE_USERS_KEY,
  LOCAL_STORAGE_ITEMS_KEY,
  INITIAL_ITEMS,
  INITIAL_ADMIN_USER,
  ADMIN_USERNAME,
} from '../constants';

const SIMULATED_DELAY = 300; // ms

// Helper para simular delay
const delay = (ms: number = SIMULATED_DELAY) => new Promise(resolve => setTimeout(resolve, ms));

// --- User Data ---
const getStoredUsers = (): User[] => {
  try {
    const item = window.localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    const parsedUsers = item ? JSON.parse(item) : [];
    // Ensure admin user exists
    if (!parsedUsers.some((u: User) => u.username === ADMIN_USERNAME && u.isAdmin)) {
      const adminUserWithId: User = {
        id: `admin_${Date.now()}`,
        ...INITIAL_ADMIN_USER,
      };
      const updatedUsers = [...parsedUsers, adminUserWithId];
      window.localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
      return updatedUsers;
    }
    return parsedUsers;
  } catch (error) {
    console.error(`Error reading users from localStorage:`, error);
    // Attempt to initialize with admin if store is corrupted or empty
    const adminUserWithId: User = { id: `admin_${Date.now()}`, ...INITIAL_ADMIN_USER };
    window.localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify([adminUserWithId]));
    return [adminUserWithId];
  }
};

const saveStoredUsers = (users: User[]): void => {
  try {
    window.localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error(`Error saving users to localStorage:`, error);
  }
};

// --- Item Data ---
const getStoredItems = (): Item[] => {
  try {
    const item = window.localStorage.getItem(LOCAL_STORAGE_ITEMS_KEY);
    const parsedItems = item ? JSON.parse(item) : [];
    // Ensure initial items exist if store is empty
    if (parsedItems.length === 0 && INITIAL_ITEMS.length > 0) {
        const itemsWithIds = INITIAL_ITEMS.map((itm, index) => ({
            ...itm,
            id: `item_${Date.now()}_${index}`,
        }));
        window.localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(itemsWithIds));
        return itemsWithIds;
    }
    return parsedItems;
  } catch (error) {
    console.error(`Error reading items from localStorage:`, error);
    // Attempt to initialize with initial items if store is corrupted or empty
    const itemsWithIds = INITIAL_ITEMS.map((itm, index) => ({
        ...itm,
        id: `item_${Date.now()}_${index}`,
    }));
    window.localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(itemsWithIds));
    return itemsWithIds;
  }
};

const saveStoredItems = (items: Item[]): void => {
  try {
    window.localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(items));
  } catch (error) {
    console.error(`Error saving items to localStorage:`, error);
  }
};

// Initialize databases on load (read from localStorage or set initial values)
// This ensures that subsequent calls to getStoredUsers/Items get the initialized data.
getStoredUsers();
getStoredItems();


// API Functions
export const api = {
  async login(username: string, password: string): Promise<User | null> {
    await delay();
    const users = getStoredUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('loggedInUserId_simulated', user.id);
      return { ...user };
    }
    return null;
  },

  async register(username: string, password: string): Promise<User | null> {
    await delay();
    let users = getStoredUsers();
    if (users.some(u => u.username === username)) {
      throw new Error('Nome de usuário já existe.');
    }
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      username,
      password, 
      tokens: 100,
      isAdmin: false,
    };
    users = [...users, newUser];
    saveStoredUsers(users);
    localStorage.setItem('loggedInUserId_simulated', newUser.id);
    return { ...newUser };
  },

  async logout(): Promise<void> {
    await delay(SIMULATED_DELAY / 2);
    localStorage.removeItem('loggedInUserId_simulated');
  },

  async getCurrentUserSession(): Promise<User | null> {
    await delay(SIMULATED_DELAY / 3);
    const loggedInUserId = localStorage.getItem('loggedInUserId_simulated');
    if (!loggedInUserId) return null;
    const users = getStoredUsers();
    const user = users.find(u => u.id === loggedInUserId);
    return user ? { ...user } : null;
  },

  async fetchAllUsers(): Promise<User[]> {
    await delay();
    return [...getStoredUsers()];
  },
  
  async updateUser(updatedUser: User): Promise<User> {
    await delay();
    let users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex === -1) throw new Error("Usuário não encontrado para atualização.");
    users[userIndex] = { ...users[userIndex], ...updatedUser };
    saveStoredUsers(users);
    return { ...users[userIndex] };
  },

  async fetchItems(): Promise<Item[]> {
    await delay();
    return [...getStoredItems()];
  },

  async addItem(itemData: Omit<Item, 'id'>): Promise<Item> {
    await delay();
    let items = getStoredItems();
    const newItem: Item = {
      ...itemData,
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
    items = [...items, newItem];
    saveStoredItems(items);
    return { ...newItem };
  },

  async addTokensToUser(userId: string, amount: number): Promise<User | null> {
    await delay();
    let users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        console.error("Usuário não encontrado para adicionar tokens:", userId);
        return null;
    }
    if (amount <=0) throw new Error("Quantidade de tokens deve ser positiva.");

    users[userIndex].tokens += amount;
    saveStoredUsers(users);
    return { ...users[userIndex] };
  },

  async purchaseItem(userId: string, itemId: string): Promise<{ user: User; item: Item } | null> {
    await delay();
    let users = getStoredUsers();
    const items = getStoredItems();

    const userIndex = users.findIndex(u => u.id === userId);
    const item = items.find(i => i.id === itemId);

    if (userIndex === -1) throw new Error("Usuário da compra não encontrado.");
    if (!item) throw new Error("Item da compra não encontrado.");
    
    if (users[userIndex].tokens < item.price) {
        throw new Error('Tokens insuficientes para comprar este item.');
    }

    users[userIndex].tokens -= item.price;
    saveStoredUsers(users);
    return { user: { ...users[userIndex] }, item: { ...item } };
  }
};
