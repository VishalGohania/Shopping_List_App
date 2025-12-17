import React, { useState } from 'react';
import type { Item } from '../types';

interface ItemCardProps {
  item: Item;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity);
  const [category, setCategory] = useState(item.category || '');

  const handleUpdate = () => {
    onUpdate(item.id, { name, quantity, category, purchased: item.purchased });
    setIsEditing(false);
  };

  const togglePurchased = () => {
    onUpdate(item.id, { purchased: !item.purchased });
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border-2 border-blue-400">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-2"
          placeholder="Item name"
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded mb-2"
          placeholder="Quantity"
          min="1"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-3"
          placeholder="Category (optional)"
        />
        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition ${item.purchased ? 'opacity-60 bg-gray-50' : ''
      }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 flex-1">
          <input
            type="checkbox"
            checked={item.purchased}
            onChange={togglePurchased}
            className="w-5 h-5 cursor-pointer"
          />
          <div>
            <h3 className={`text-lg font-semibold ${item.purchased ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {item.name}
            </h3>
            {item.category && (
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {item.category}
              </span>
            )}
          </div>
        </div>
        <span className="text-xl font-bold text-blue-600">×{item.quantity}</span>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => setIsEditing(true)}
          className="flex-1 bg-blue-500 text-white py-1.5 px-3 rounded hover:bg-blue-600 text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="flex-1 bg-red-500 text-white py-1.5 px-3 rounded hover:bg-red-600 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
