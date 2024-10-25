'use client';

import { useState } from 'react';
import SettingsModal from './SettingsModal';

interface SidebarProps {
  selectedFlightline: number;
  onFlightlineSelect: (flightline: number) => void;
}

export default function Sidebar({ selectedFlightline, onFlightlineSelect }: SidebarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [rotationInterval, setRotationInterval] = useState(10000);

  const handleSaveSettings = async (newInterval: number) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rotationInterval: newInterval }),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      setRotationInterval(newInterval);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white p-4">
        <div className="mb-8">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors mb-4"
          >
            Settings
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4">Flightlines</h2>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((flightline) => (
            <button
              key={flightline}
              onClick={() => onFlightlineSelect(flightline)}
              className={`w-full text-left py-2 px-4 rounded ${
                selectedFlightline === flightline
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-700'
              }`}
            >
              Flightline {flightline}
            </button>
          ))}
        </div>
      </aside>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentInterval={rotationInterval}
        onSave={handleSaveSettings}
      />
    </>
  );
}
