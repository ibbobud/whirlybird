'use client';

interface SidebarProps {
  selectedFlightline: number;
  onFlightlineSelect: (flightline: number) => void;
}

export default function Sidebar({ selectedFlightline, onFlightlineSelect }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-800 h-screen fixed left-0 top-0 p-4">
      <h2 className="text-white text-xl font-bold mb-6">Flightlines</h2>
      <div className="space-y-2">
        {[1, 2, 3].map((flightline) => (
          <button
            key={flightline}
            onClick={() => onFlightlineSelect(flightline)}
            className={`w-full text-left px-4 py-2 rounded ${
              selectedFlightline === flightline
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Flightline {flightline}
          </button>
        ))}
      </div>
    </div>
  );
}
