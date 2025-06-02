import { Item, User } from './types';

export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'admin'; // In a real app, this would be handled securely

export const LOCAL_STORAGE_USERS_KEY = 'rpgShopUsers';
export const LOCAL_STORAGE_ITEMS_KEY = 'rpgShopItems';

export const INITIAL_ITEMS: Omit<Item, 'id'>[] = [
  {
    name: 'Poção de Vida',
    description: 'Restaura 50 PV. Cheira levemente a cerejas.',
    price: 10,
    imageUrl: 'https://picsum.photos/seed/potion/200/200',
  },
  {
    name: 'Elixir de Mana',
    description: 'Restaura 30 PM. Formiga na língua.',
    price: 15,
    imageUrl: 'https://picsum.photos/seed/elixir/200/200',
  },
  {
    name: 'Espada de Ferro',
    description: 'Uma espada resistente para aventureiros corajosos.',
    price: 50,
    imageUrl: 'https://picsum.photos/seed/sword/200/200',
  },
  {
    name: 'Conjunto de Armadura de Couro',
    description: 'Proteção básica, leve e flexível.',
    price: 75,
    imageUrl: 'https://picsum.photos/seed/armor/200/200',
  },
  {
    name: 'Mapa do Reino Perdido',
    description: 'Dizem que leva a riquezas incalculáveis... ou perigo.',
    price: 30,
    imageUrl: 'https://picsum.photos/seed/map/200/200',
  },
  {
    name: 'Bolsa de Carga (Pequena)',
    description: 'Magicamente comporta mais do que aparenta. Capacidade: 20 itens.',
    price: 200,
    imageUrl: 'https://picsum.photos/seed/bag/200/200',
  }
];

export const INITIAL_ADMIN_USER: Omit<User, 'id'> = {
  username: ADMIN_USERNAME,
  password: ADMIN_PASSWORD,
  tokens: 10000, // Admin starts with a lot of tokens
  isAdmin: true,
};