import RotatingIframe from './components/RotatingIframe'
import Header from './components/Header'
import { readExcelFile } from './utils/excel'
import { Suspense } from 'react'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

type BayResult = 
  | { error: 'missing-params' }
  | { error: 'bay-not-found'; bayNumber: number; flightline: number }
  | { bay: { 
      bayNumber: number;
      flightline: number;
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

async function getBayData(searchParams: Promise<Props['searchParams']>): Promise<BayResult> {
  const bays = await readExcelFile()
  const resolvedParams = await searchParams
  
  const bayParam = resolvedParams?.bay
  const flightlineParam = resolvedParams?.flightline
  
  const bayNumber = typeof bayParam === 'string' ? parseInt(bayParam, 10) : null
  const flightline = typeof flightlineParam === 'string' ? parseInt(flightlineParam, 10) : null

  if (!bayNumber || !flightline) {
    return { error: 'missing-params' }
  }

  const bay = bays.find(b => b.bayNumber === bayNumber && b.flightline === flightline)
  if (!bay) {
    return { error: 'bay-not-found', bayNumber, flightline }
  }

  return { bay }
}

export default async function Home({ searchParams }: Props) {
  const result = await getBayData(Promise.resolve(searchParams))

  if ('error' in result) {
    if (result.error === 'missing-params') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">
            Please provide both bay and flightline numbers in the URL (e.g., /?bay=1&flightline=1)
          </div>
        </div>
      )
    }
    
    if (result.error === 'bay-not-found') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">
            Bay {result.bayNumber} in Flightline {result.flightline} not found
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
