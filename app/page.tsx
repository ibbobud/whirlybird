import { BayData } from './utils/excel';
import Header from './components/Header';
import RotatingIframe from './components/RotatingIframe';
import { Suspense } from 'react';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const SAMPLE_URLS = [
  'https://example.com/metrics1',
  'https://example.com/metrics2',
  'https://example.com/metrics3'
];

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-2xl font-bold">Loading...</div>
    </div>
  );
}

export default async function Home({ searchParams }: PageProps) {
  // Remove direct access of searchParams.bay and use a default value
  const bayNumber = 1;

  return (
    <main className="min-h-screen">
      <Header
        importanceRank={1}
        serialNumber="AC123456"
        customerName="Sample Airlines"
      />
      <RotatingIframe 
        urls={SAMPLE_URLS}
        rotationInterval={10000}
      />
    </main>
  );
}
