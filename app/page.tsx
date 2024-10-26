import RotatingIframe from './components/RotatingIframe'
import Header from './components/Header'
import { readExcelFile } from './utils/excel'
import { Suspense } from 'react'

type BayResult = 
  | { error: 'missing-params' }
  | { error: 'bay-not-found'; bayNumber: string; hangar: number }
  | { bay: { 
      bayNumber: string;
      hangar: number;
      rank: number;
      serialNumber: string;
      customerName: string;
      urls: string[];
    }}

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-2xl font-bold">Loading...</div>
    </div>
  )
}

async function getBayData(searchParams: Record<string, string | string[] | undefined>): Promise<BayResult> {
  const bays = await readExcelFile()
  
  const bayParam = searchParams?.bay
  const hangarParam = searchParams?.hangar
  
  const bayNumber = typeof bayParam === 'string' ? bayParam : null
  const hangar = typeof hangarParam === 'string' ? parseInt(hangarParam, 10) : null

  if (!bayNumber || !hangar) {
    return { error: 'missing-params' }
  }

  const bay = bays.find(b => b.bayNumber === bayNumber && b.hangar === hangar)
  if (!bay) {
    return { error: 'bay-not-found', bayNumber, hangar }
  }

  return { bay }
}

interface PageProps {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const result = await getBayData(resolvedSearchParams)

  if ('error' in result) {
    if (result.error === 'missing-params') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">
            Please provide both bay and hangar numbers in the URL (e.g., /?bay=2-1&hangar=1)
          </div>
        </div>
      )
    }
    
    if (result.error === 'bay-not-found') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">
            Bay {result.bayNumber} in Hangar {result.hangar} not found
          </div>
        </div>
      )
    }
  }

  return (
    <main className="h-screen flex flex-col">
      <Header
        importanceRank={result.bay.rank}
        serialNumber={result.bay.serialNumber}
        customerName={result.bay.customerName}
      />
      <div className="flex-1 pt-20 h-[calc(100vh-5rem)]">
        <Suspense fallback={<Loading />}>
          <RotatingIframe 
            urls={result.bay.urls}
            rotationInterval={10000}
          />
        </Suspense>
      </div>
    </main>
  )
}
