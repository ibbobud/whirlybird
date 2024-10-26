'use client';

import { BayData } from '../../utils/excel';
import { FaEdit } from 'react-icons/fa';

interface BayGridProps {
  bays: BayData[];
  onEditBay: (bay: BayData) => void;
  onEditUrls: (bay: BayData) => void;
}

export default function BayGrid({ bays, onEditBay, onEditUrls }: BayGridProps) {
  const rows = 7;
  const cols = 2;

  const createEmptyBay = (bayNumber: string): BayData => ({
    bayNumber,
    hangar: parseInt(bayNumber.split('-')[0]),
    serialNumber: '',
    customerName: '',
    rank: 0,
    urls: []
  });

  const getHangarBayNumber = (rowIndex: number, colIndex: number): string => {
    if (colIndex === 1) {
      const hangarNumber = Math.floor(rowIndex / 2) * 2 + 1;
      const bayInHangar = (rowIndex % 2) + 1;
      return `${hangarNumber}-${bayInHangar}`;
    } else {
      const hangarNumber = Math.floor(rowIndex / 2) * 2 + 2;
      const bayInHangar = (rowIndex % 2) + 1;
      return `${hangarNumber}-${bayInHangar}`;
    }
  };

  // Function to determine if this is the first bay in a hangar pair
  const isFirstInHangarPair = (rowIndex: number) => rowIndex % 2 === 0;

  // Function to render the bay title with styled rank
  const BayTitle = ({ bay, displayBayNumber }: { bay: BayData, displayBayNumber: string }) => {
    if (bay.rank > 0) {
      return (
        <h3 className="font-bold flex items-center gap-2">
          <span className="text-blue-600 font-extrabold">Rank {bay.rank}</span>
          <span>-</span>
          <span>Bay {displayBayNumber}</span>
        </h3>
      );
    }
    return <h3 className="font-bold">Bay {displayBayNumber}</h3>;
  };

  // Create array of rows in normal order for top-to-bottom rendering
  const rowIndices = Array.from({ length: rows }, (_, i) => i);

  return (
    <div className="flex flex-col gap-2 p-4 max-w-4xl mx-auto">
      {rowIndices.map((rowIndex) => (
        <div 
          key={rowIndex} 
          className={`grid grid-cols-2 gap-4 ${isFirstInHangarPair(rowIndex) ? 'mt-6' : 'mb-6'}`}
        >
          {Array.from({ length: cols }).map((_, colIndex) => {
            const bayNumber = getHangarBayNumber(rowIndex, colIndex);
            const bay = bays.find(b => b.bayNumber === bayNumber) || 
                       createEmptyBay(bayNumber);

            return (
              <div
                key={colIndex}
                className={`
                  bg-white p-4 rounded-lg shadow-md w-full
                  ${isFirstInHangarPair(rowIndex) ? 'border-t-4 border-blue-500' : 'border-b-4 border-blue-500'}
                  ${isFirstInHangarPair(rowIndex) ? 'rounded-b-none' : 'rounded-t-none'}
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <BayTitle bay={bay} displayBayNumber={bayNumber} />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditBay(bay)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onEditUrls(bay)}
                      className="text-green-600 hover:text-green-800 px-2 py-1 text-sm"
                    >
                      URLs
                    </button>
                  </div>
                </div>
                {bay.serialNumber ? (
                  <div className="text-sm">
                    <p>Serial: {bay.serialNumber}</p>
                    <p>Customer: {bay.customerName}</p>
                    <p>Rank: {bay.rank}</p>
                    <p>URLs: {bay.urls.length}</p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">
                    <p>Empty Bay</p>
                    <p>Click Edit to configure</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
