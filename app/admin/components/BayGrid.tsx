'use client';

import { useState } from 'react';
import { BayData } from '../../utils/excel';
import { FaEdit } from 'react-icons/fa';

interface BayGridProps {
  bays: BayData[];
  onEditBay: (bay: BayData) => void;
  onEditUrls: (bay: BayData) => void;
}

export default function BayGrid({ bays, onEditBay, onEditUrls }: BayGridProps) {
  const rows = 2;
  const cols = 7;

  const createEmptyBay = (bayNumber: number, flightline: number): BayData => ({
    bayNumber,
    flightline,
    serialNumber: '',
    customerName: '',
    rank: 0,
    urls: []
  });

  return (
    <div className="grid grid-rows-2 gap-4 p-4">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-7 gap-4">
          {Array.from({ length: cols }).map((_, colIndex) => {
            const bayNumber = rowIndex * cols + colIndex + 1;
            const bay = bays.find(b => b.bayNumber === bayNumber) || createEmptyBay(bayNumber, bays[0]?.flightline || 1);

            return (
              <div
                key={colIndex}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">Bay {bayNumber}</h3>
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