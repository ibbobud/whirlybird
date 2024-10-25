'use client';

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BayGrid from './components/BayGrid';
import EditBayModal from './components/EditBayModal';
import EditUrlsModal from './components/EditUrlsModal';
import { BayData } from '../utils/excel';

type ModalState = {
  type: 'bay' | 'urls' | null;
  bay: BayData | null;
};

export default function AdminPage() {
  const [selectedFlightline, setSelectedFlightline] = useState(1);
  const [bays, setBays] = useState<BayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ type: null, bay: null });
  const [error, setError] = useState<string | null>(null);

  const fetchBays = async () => {
    try {
      const response = await fetch('/api/bays');
      if (!response.ok) throw new Error('Failed to fetch bays');
      const data = await response.json();
      setBays(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching bays:', error);
      setError('Failed to load bays');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBays();
  }, []);

  const handleFlightlineSelect = (flightline: number) => {
    setSelectedFlightline(flightline);
  };

  const handleEditBay = (bay: BayData) => {
    setModal({ type: 'bay', bay: { ...bay, flightline: selectedFlightline } });
  };

  const handleEditUrls = (bay: BayData) => {
    setModal({ type: 'urls', bay: { ...bay, flightline: selectedFlightline } });
  };

  const handleCloseModal = () => {
    setModal({ type: null, bay: null });
  };

  const handleSaveChanges = async (updatedBay: BayData) => {
    try {
      setError(null);
      const response = await fetch('/api/bay', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedBay,
          flightline: selectedFlightline
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update bay');
      }
      
      await fetchBays();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving changes:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const filteredBays = bays.filter(bay => bay.flightline === selectedFlightline);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar
        selectedFlightline={selectedFlightline}
        onFlightlineSelect={handleFlightlineSelect}
      />
      <main className="ml-64 flex-1 bg-gray-100 min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-6 w-full text-center">Hangar {selectedFlightline} Bays</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <BayGrid
          bays={filteredBays}
          onEditBay={handleEditBay}
          onEditUrls={handleEditUrls}
        />
        {modal.type === 'bay' && modal.bay && (
          <EditBayModal
            bay={modal.bay}
            onClose={handleCloseModal}
            onSave={handleSaveChanges}
          />
        )}
        {modal.type === 'urls' && modal.bay && (
          <EditUrlsModal
            bay={modal.bay}
            onClose={handleCloseModal}
            onSave={handleSaveChanges}
          />
        )}
      </main>
    </div>
  );
}
