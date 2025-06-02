
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useShop } from '../contexts/ShopContext';
import { Item, User } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';

const PlusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21C7.331 21 6.142 20.583 5.185 19.82 pertinentesM15 19.128a9.37 9.37 0 0 0-2.625-.372M9.375 16.043a9.37 9.37 0 0 1-2.625-.372M9.375 16.043s-7.5-.562-7.5-6.328a7.5 7.5 0 0 1 7.5-6.328 7.5 7.5 0 0 1 7.5 6.328c0 5.766-7.5 6.328-7.5 6.328Zm0 0A3.375 3.375 0 0 1 12 12.75a3.375 3.375 0 0 1 2.625 3.293m-5.25 0s-1.125-.225-1.125-1.5c0-1.275 1.125-1.5 1.125-1.5m0 0a3.375 3.375 0 0 1 2.625 0m0 0a3.375 3.375 0 0 1 2.625 0M12 15.75a3.375 3.375 0 0 1-2.625-3.293M12 15.75V12m0 3.75c.621 0 1.194-.034 1.75-.1a3.375 3.375 0 0 1 1.75-.1m-3.5 0a3.375 3.375 0 0 0-1.75-.1M12 15.75V12m0 3.75a3.375 3.375 0 0 0-1.75.1m3.5 0a3.375 3.375 0 0 0 1.75.1m0 0V12" />
</svg>
);

const ArchiveBoxIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10.5 11.25h3M12 15V7.5m0 0L10.5 6A1.5 1.5 0 0 0 9 7.5h6A1.5 1.5 0 0 0 13.5 6L12 7.5Z" />
</svg>
);


const AdminItemForm: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  // isLoading from useShop is for fetching items or general shop operations.
  // For adding an item, we might want a specific loading state or rely on the global one.
  const { addItem, isLoading: isShopLoading } = useShop(); 
  const { addNotification } = useAuth();
  const [isAddingItem, setIsAddingItem] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !imageUrl) {
      addNotification('Por favor, preencha todos os campos.', 'error');
      return;
    }
    const priceNum = parseInt(price, 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      addNotification('O preço deve ser um número positivo.', 'error');
      return;
    }
    setIsAddingItem(true);
    await addItem({ name, description, price: priceNum, imageUrl });
    setIsAddingItem(false);
    // Clear form only on success, which is handled by addItem itself via notifications
    setName('');
    setDescription('');
    setPrice('');
    setImageUrl(`https://picsum.photos/seed/${Math.random().toString().slice(2,10)}/200/200`); 
  };

  useEffect(() => {
    setImageUrl(`https://picsum.photos/seed/${Math.random().toString().slice(2,10)}/200/200`);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-indigo-300 mb-4">Adicionar Novo Item</h3>
      <Input label="Nome do Item" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input label="Descrição" type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <Input label="Preço (Tokens)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <div className="flex items-end space-x-2">
        <Input label="URL da Imagem" type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required className="flex-grow"/>
        <Button type="button" variant="secondary" onClick={() => setImageUrl(`https://picsum.photos/seed/${Math.random().toString().slice(2,10)}/200/200`)} className="h-10">Aleatória</Button>
      </div>
      {imageUrl && <img src={imageUrl} alt="Pré-visualização" className="w-24 h-24 object-cover rounded mt-2"/>}
      <Button type="submit" isLoading={isAddingItem || isShopLoading} variant="primary" icon={<PlusCircleIcon className="w-5 h-5"/>}>Adicionar Item</Button>
    </form>
  );
};

const AdminUserManagement: React.FC = () => {
  const { allUsers, addTokensToUser, currentUser, addNotification, isUserListLoading, fetchAllUsersForAdmin } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [isUpdatingTokens, setIsUpdatingTokens] = useState(false);
  
  const displayUsers = currentUser?.isAdmin ? allUsers.filter(u => u.id !== currentUser.id && !u.isAdmin) : [];

  useEffect(() => {
     // Re-fetch users if the component mounts and current user is admin
    if (currentUser?.isAdmin) {
        fetchAllUsersForAdmin();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.isAdmin]); // fetchAllUsersForAdmin is memoized

  useEffect(() => {
    if (displayUsers.length > 0 && !displayUsers.find(u => u.id === selectedUserId)) {
      setSelectedUserId(displayUsers[0].id);
    } else if (displayUsers.length === 0) {
        setSelectedUserId('');
    }
  }, [displayUsers, selectedUserId]);


  const handleAddTokens = async () => {
    const amountNum = parseInt(tokenAmount, 10);
    if (!selectedUserId) {
      addNotification('Por favor, selecione um usuário.', 'error');
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      addNotification('Por favor, insira uma quantidade de tokens válida e positiva.', 'error');
      return;
    }
    setIsUpdatingTokens(true);
    await addTokensToUser(selectedUserId, amountNum);
    // The user list (allUsers) is updated within addTokensToUser in AuthContext
    setTokenAmount('');
    setIsUpdatingTokens(false);
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-indigo-300 mb-6">Gerenciar Tokens de Usuário</h3>
      {isUserListLoading && displayUsers.length === 0 && <p className="text-gray-400">Carregando usuários...</p>}
      {!isUserListLoading && displayUsers.length === 0 && <p className="text-gray-400">Nenhum outro usuário (não admin) para gerenciar.</p>}
      
      {displayUsers.length > 0 && (
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-750">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome de Usuário</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tokens Atuais</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">É Admin?</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {displayUsers.map((user) => (
                <tr key={user.id} className={`${selectedUserId === user.id ? 'bg-gray-700' : ''} hover:bg-gray-750 transition-colors cursor-pointer`} onClick={() => setSelectedUserId(user.id)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">{user.tokens}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.isAdmin ? 'Sim' : 'Não'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-end space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-full sm:w-auto flex-grow">
            <label htmlFor="user-select" className="block text-sm font-medium text-gray-300 mb-1">Selecionar Usuário</label>
            <select
              id="user-select"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-700 text-gray-100"
              disabled={displayUsers.length === 0 || isUserListLoading || isUpdatingTokens}
            >
              {displayUsers.map(user => (
                <option key={user.id} value={user.id}>{user.username} ({user.tokens} Tokens)</option>
              ))}
            </select>
          </div>
          <Input
            label="Tokens para Adicionar"
            type="number"
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
            placeholder="ex: 100"
            className="w-full sm:w-auto"
            disabled={displayUsers.length === 0 || isUserListLoading || isUpdatingTokens}
          />
          <Button 
            onClick={handleAddTokens} 
            variant="primary" 
            icon={<PlusCircleIcon className="w-5 h-5"/>} 
            className="w-full sm:w-auto" 
            disabled={displayUsers.length === 0 || !selectedUserId || isUserListLoading || isUpdatingTokens}
            isLoading={isUpdatingTokens}
          >
            Adicionar Tokens
          </Button>
        </div>
      </div>
      )}
    </div>
  );
};


const AdminPanel: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'items' | 'users'>('items');

  if (!currentUser?.isAdmin) {
    return <div className="text-center py-10 text-xl text-red-500">Acesso Negado. Privilégios de administrador necessários.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-indigo-400 mb-10">Painel do Administrador</h1>
      
      <div className="mb-8 flex justify-center border-b border-gray-700">
        <button
          onClick={() => setActiveTab('items')}
          className={`py-3 px-6 font-medium text-lg transition-colors ${activeTab === 'items' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-indigo-300'}`}
          aria-label="Gerenciar Itens Aba"
        >
          <ArchiveBoxIcon className="w-5 h-5 inline mr-2" /> Gerenciar Itens
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-6 font-medium text-lg transition-colors ${activeTab === 'users' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-indigo-300'}`}
          aria-label="Gerenciar Usuários Aba"
        >
           <UsersIcon className="w-5 h-5 inline mr-2" /> Gerenciar Usuários
        </button>
      </div>

      {activeTab === 'items' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AdminItemForm />
          <div className="p-6 bg-gray-800 rounded-lg shadow-md">
             <h3 className="text-xl font-semibold text-indigo-300 mb-4">Itens Atuais</h3>
             <ItemList />
          </div>
        </div>
      )}
      
      {activeTab === 'users' && <AdminUserManagement />}
    </div>
  );
};

const ItemList: React.FC = () => {
  const { items, isLoading } = useShop(); // isLoading here refers to fetching items

  if (isLoading && items.length === 0) return <p className="text-gray-400">Carregando itens...</p>;
  if (items.length === 0) return <p className="text-gray-400">Nenhum item na loja ainda.</p>;

  return (
    <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
      {items.map(item => (
        <div key={item.id} className="p-3 bg-gray-700 rounded-md flex justify-between items-center">
          <div>
            <p className="font-medium text-gray-100">{item.name}</p>
            <p className="text-xs text-gray-400">{item.price} Tokens</p>
          </div>
          <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded-sm ml-2"/>
        </div>
      ))}
    </div>
  );
}


export default AdminPanel;
