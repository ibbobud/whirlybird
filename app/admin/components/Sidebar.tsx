'use client';

import { useState } from 'react';
import SettingsModal from './SettingsModal';

interface SidebarProps {
  selectedFlightline: number;
  onFlightlineSelect: (flightline: number) => void;
}

export default function Sidebar({ selectedFlightline, onFlightlineSelect }: SidebarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    refreshInterval: 30
  });

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
        <h2 className="text-xl font-bold mb-4">Hangars</h2>
        <div className="space-y-2">
          {[1, 2, 3].map((hangar) => (
            <button
              key={hangar}
              onClick={() => onFlightlineSelect(hangar)}
              className={`w-full text-left py-2 px-4 rounded ${
                selectedFlightline === hangar
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-700'
              }`}
            >
              Hangar {hangar}
            </button>
          ))}
        </div>
      </aside>
      <SettingsModal
        isOpen={isSettingsOpen}
        closeModal={() => setIsSettingsOpen(false)}
        settings={settings}
      />
    </>
  );
}
