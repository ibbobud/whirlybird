'use client';

import { useState, useEffect } from 'react';
import { BayData } from '../../utils/excel';

interface EditBayModalProps {
  bay: BayData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (bay: BayData) => void;
}

export default function EditBayModal({ bay, isOpen, onClose, onSave }: EditBayModalProps) {
  const [editedBay, setEditedBay] = useState<BayData>(bay);

  useEffect(() => {
    setEditedBay(bay);
  }, [bay]);

  const handleSave = () => {
    onSave(editedBay);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Bay {editedBay.bayNumber}</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Serial Number</label>
          <input
            type="text"
            value={editedBay.serialNumber}
            onChange={(e) => setEditedBay({ ...editedBay, serialNumber: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Customer Name</label>
          <input
            type="text"
            value={editedBay.customerName}
            onChange={(e) => setEditedBay({ ...editedBay, customerName: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Hangar</label>
          <input
            type="number"
            value={editedBay.hangar}
            onChange={(e) => setEditedBay({ ...editedBay, hangar: parseInt(e.target.value) || 0 })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Rank</label>
          <input
            type="number"
            value={editedBay.rank}
            onChange={(e) => setEditedBay({ ...editedBay, rank: parseInt(e.target.value) || 0 })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
