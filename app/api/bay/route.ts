import { NextRequest, NextResponse } from 'next/server';
import { readExcelFile, writeExcelFile, BayData } from '../../utils/excel';

export async function PUT(request: Request) {
    try {
        const updatedBay: BayData = await request.json();
        
        // Validate the incoming data
        if (!updatedBay || !updatedBay.bayNumber || !updatedBay.serialNumber || 
            !updatedBay.customerName || !updatedBay.rank || !updatedBay.flightline) {
            return NextResponse.json(
                { error: 'Invalid bay data. Missing required fields.' },
                { status: 400 }
            );
        }

        // Read current data
        const bays = await readExcelFile();

        // Find and update the bay - now checking both bayNumber AND flightline
        const bayIndex = bays.findIndex(b => 
            b.bayNumber === updatedBay.bayNumber && 
            b.flightline === updatedBay.flightline
        );

        if (bayIndex === -1) {
            // If bay doesn't exist for this flightline, add it
            bays.push({
                ...updatedBay,
                urls: updatedBay.urls || []
            });
        } else {
            // Update existing bay
            bays[bayIndex] = {
                ...updatedBay,
                urls: updatedBay.urls || bays[bayIndex].urls || []
            };
        }

        // Write updated data back to file
        await writeExcelFile(bays);

        return NextResponse.json({ 
            success: true, 
            bay: bayIndex === -1 ? updatedBay : bays[bayIndex] 
        });
    } catch (error) {
        console.error('Error updating bay:', error);
        return NextResponse.json(
            { error: 'Internal server error while updating bay' },
            { status: 500 }
        );
    }
}
