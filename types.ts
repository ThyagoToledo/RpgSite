
export interface User {
  id: string;
  username: string;
  password?: string; // Optional because we don't store it after hashing in a real app, but will for this demo
  tokens: number;
  isAdmin: boolean;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

// Context types
export interface AuthContextType {
  currentUser: User | null;
  allUsers: User[]; // For admin to manage and display
  login: (username: string, password: string) => Promise<User | null>;
  register: (username: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  addTokensToUser: (userId: string, amount: number) => Promise<User | null>; // Admin action
  fetchCurrentUser: () => Promise<void>; // To refresh current user data
  fetchAllUsersForAdmin: () => Promise<void>; // To refresh all users list for admin
  addNotification: (message: string, type: NotificationType) => void; // For global notifications
  isLoading: boolean; // General loading for auth operations
  isUserListLoading: boolean; // Specific loading for the allUsers list
}

export interface ShopContextType {
  items: Item[];
  addItem: (item: Omit<Item, 'id'>) => Promise<Item | null>; // Admin action
  purchaseItem: (itemId: string, userId: string) => Promise<{ user: User; item: Item } | null>;
  isLoading: boolean; // Loading for shop operations (fetching items, adding items)
  isPurchasing: (itemId: string) => boolean; // To check if a specific item purchase is in progress
  setPurchaseState: (itemId: string, isLoading: boolean) => void; // To manage individual item purchase loading state
}

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}