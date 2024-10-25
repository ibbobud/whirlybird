'use client';

import { useState } from 'react';
import { BayData } from '../../utils/excel';
import { FaTrash, FaPlus } from 'react-icons/fa';

interface EditUrlsModalProps {
  bay: BayData;
  onClose: () => void;
  onSave: (updatedBay: BayData) => void;
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function EditUrlsModal({ bay, onClose, onSave }: EditUrlsModalProps) {
  const [urls, setUrls] = useState<string[]>(Array.isArray(bay.urls) ? bay.urls : []);
  const [error, setError] = useState<string | null>(null);

  const handleAddUrl = () => {
    setUrls([...urls, '']);
    setError(null);
  };

  const handleRemoveUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
    setError(null);
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty URLs and validate format
    const validUrls = urls
      .map(url => url.trim())
      .filter(url => url !== '');

    // Validate URL format
    const invalidUrls = validUrls.filter(url => !isValidUrl(url));
    if (invalidUrls.length > 0) {
      setError('Please enter valid URLs');
      return;
    }

    // Preserve all existing bay data and only update the URLs
    onSave({
      ...bay,  // This preserves all existing bay data
      urls: validUrls
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit URLs for Bay {bay.bayNumber}</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-2 mb-4">
            {urls.map((url, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Enter URL (e.g., https://example.com)"
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
