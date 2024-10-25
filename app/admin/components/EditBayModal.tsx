'use client';

import { useState } from 'react';
import { BayData } from '@/app/utils/excel';

interface EditBayModalProps {
  bay: BayData;
  onClose: () => void;
  onSave: (updatedBay: BayData) => void;
}

export default function EditBayModal({ bay, onClose, onSave }: EditBayModalProps) {
  const [formData, setFormData] = useState({
    serialNumber: bay.serialNumber,
    customerName: bay.customerName,
    rank: bay.rank.toString()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...bay,
      serialNumber: formData.serialNumber,
      customerName: formData.customerName,
      rank: parseInt(formData.rank)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Bay {bay.bayNumber}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Serial Number</label>
            <input
              type="text"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Rank</label>
            <input
              type="number"
              value={formData.rank}
              onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
