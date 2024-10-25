import RotatingIframe from './components/RotatingIframe'
import Header from './components/Header'
import { readExcelFile } from './utils/excel'
import { Suspense } from 'react'

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-2xl font-bold">Loading...</div>
    </div>
  )
}

export default async function Home({ searchParams }: PageProps) {
  // Read bay data first
  const bays = await readExcelFile()
  
  // Then handle the search params
  const bayParam = searchParams.bay
  const flightlineParam = searchParams.flightline
  
  const bayNumber = typeof bayParam === 'string' ? parseInt(bayParam, 10) : null
  const flightline = typeof flightlineParam === 'string' ? parseInt(flightlineParam, 10) : null

  if (!bayNumber || !flightline) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">
          Please provide both bay and flightline numbers in the URL (e.g., /?bay=1&flightline=1)
        </div>
      </div>
    )
  }

  const bay = bays.find(b => b.bayNumber === bayNumber && b.flightline === flightline)

  if (!bay) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">
          Bay {bayNumber} in Flightline {flightline} not found
        </div>
      </div>
    )
  }

  return (
    <main className="flex flex-col h-screen overflow-hidden">
      <Header
        importanceRank={bay.rank}
        serialNumber={bay.serialNumber}
        customerName={bay.customerName}
      />
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<Loading />}>
          <RotatingIframe 
            urls={bay.urls}
            rotationInterval={10000}
          />
        </Suspense>
      </div>
    </main>
  )
}
