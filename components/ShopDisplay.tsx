
import React from 'react';
import { useShop } from '../contexts/ShopContext';
import { useAuth } from '../contexts/AuthContext';
import { Item } from '../types';
import Button from './ui/Button';

const ShoppingCartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
</svg>
);


const ShopItemCard: React.FC<{ item: Item; onPurchase: (itemId: string) => void; itemIsLoading: boolean; canAfford: boolean; isLoggedIn: boolean }> = ({ item, onPurchase, itemIsLoading, canAfford, isLoggedIn }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
      <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover"/>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-indigo-300 mb-2">{item.name}</h3>
        <p className="text-gray-400 text-sm mb-4 flex-grow">{item.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <p className="text-2xl font-bold text-yellow-400">{item.price} Tokens</p>
          {isLoggedIn ? (
            <Button 
              onClick={() => onPurchase(item.id)} 
              isLoading={itemIsLoading} 
              disabled={itemIsLoading || !canAfford}
              variant={canAfford ? "primary" : "secondary"}
              size="sm"
              icon={<ShoppingCartIcon className="w-4 h-4"/>}
            >
              {canAfford ? "Comprar" : "Muito Caro"}
            </Button>
          ) : (
             <Button variant="secondary" size="sm" disabled>Entre para Comprar</Button>
          )}
        </div>
      </div>
    </div>
  );
};

const ShopDisplay: React.FC = () => {
  const { items, purchaseItem, isLoading: shopItemsLoading, isPurchasing } = useShop();
  const { currentUser, isLoading: authLoading } = useAuth();


  const handlePurchase = async (itemId: string) => {
    if (!currentUser) return;
    // No need to manage purchaseStates locally, ShopContext does it via isPurchasing and setPurchaseState
    await purchaseItem(itemId, currentUser.id);
  };

  if (authLoading) { // Primary loading for user session
    return <div className="text-center py-10 text-xl">Carregando dados do usuário...</div>;
  }
  
  if (shopItemsLoading && items.length === 0) { // Loading for items if no items are yet displayed
     return <div className="text-center py-10 text-xl">Carregando itens...</div>;
  }

  if (items.length === 0 && !shopItemsLoading) { // No items and not loading (empty shop)
    return <div className="text-center py-10 text-xl text-gray-400">A loja está vazia no momento. Volte mais tarde!</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-indigo-400 mb-12">Bem-vindo à Loja!</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map(item => (
          <ShopItemCard 
            key={item.id} 
            item={item} 
            onPurchase={handlePurchase}
            itemIsLoading={isPurchasing(item.id)} // Use isPurchasing from context
            canAfford={currentUser ? currentUser.tokens >= item.price : false}
            isLoggedIn={!!currentUser}
          />
        ))}
      </div>
    </div>
  );
};

export default ShopDisplay;
