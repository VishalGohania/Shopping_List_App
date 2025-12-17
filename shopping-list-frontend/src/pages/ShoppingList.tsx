import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getItems, createItem, updateItem, deleteItem } from '../services/api';
import ItemCard from '../components/ItemCard';
import type { CreateItemRequest, Item, UpdateItemRequest } from '../types';

const ShoppingList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemCategory, setNewItemCategory] = useState('');
  const [adding, setAdding] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getItems();
      setItems(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load items');
      console.error("Failed to load item", err)
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setAdding(true);
    try {
      const data: CreateItemRequest = {
        name: newItemName,
        quantity: newItemQuantity,
        category: newItemCategory || undefined,
      };
      await createItem(data);
      await fetchItems();

      setNewItemName('');
      setNewItemQuantity(1);
      setNewItemCategory('');
      setError('');
    } catch (err) {
      setError('Failed to add item');
      console.error("Failed to add item: ", err);
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateItem = async (id: string, data: UpdateItemRequest) => {
    try {
      await updateItem(id, data);
      await fetchItems();
    } catch (err) {
      setError('Failed to update item');
      console.error("Failed to update: ", err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return;

    try {
      await deleteItem(id);
      await fetchItems();
    } catch (err) {
      setError('Failed to delete item');
      console.error('Delete error:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Shopping List</h1>
              <p className="text-gray-600 mt-1">Welcome, {user?.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Item</h2>
          <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Item name"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="number"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(Number(e.target.value))}
              placeholder="Quantity"
              min="1"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              placeholder="Category (optional)"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={adding}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 font-medium transition"
            >
              {adding ? 'Adding...' : 'Add Item'}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              No items yet. Add your first item above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items
                .filter(item => item && item.id)
                .map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onUpdate={handleUpdateItem}
                    onDelete={handleDeleteItem}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
