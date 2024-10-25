'use client';

import { useState } from 'react';
import { BayData } from '../../utils/excel';
import { FaTrash, FaPlus } from 'react-icons/fa';

interface EditUrlsModalProps {
  bay: BayData;
  onClose: () => void;
  onSave: (updatedBay: BayData) => void;
}

export default function EditUrlsModal({ bay, onClose, onSave }: EditUrlsModalProps) {
  const [urls, setUrls] = useState<string[]>(bay.urls || []);

  const handleAddUrl = () => {
    setUrls([...urls, '']);
  };

  const handleRemoveUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send all bay data along with updated URLs
    onSave({
      ...bay,
      urls: urls.filter(url => url.trim() !== '')
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit URLs for Bay {bay.bayNumber}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2 mb-4">
            {urls.map((url, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Enter URL"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveUrl(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddUrl}
            className="mb-4 flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <FaPlus /> <span>Add URL</span>
          </button>
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
