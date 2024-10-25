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

        // Find and update the bay
        const bayIndex = bays.findIndex(b => b.bayNumber === updatedBay.bayNumber);
        if (bayIndex === -1) {
            return NextResponse.json(
                { error: `Bay with number ${updatedBay.bayNumber} not found` },
                { status: 404 }
            );
        }

        // Update the bay in the array
        bays[bayIndex] = {
            ...bays[bayIndex],
            urls: updatedBay.urls || []
        };

        // Write updated data back to file
        await writeExcelFile(bays);

        return NextResponse.json({ success: true, bay: bays[bayIndex] });
    } catch (error) {
        console.error('Error updating bay:', error);
        return NextResponse.json(
            { error: 'Internal server error while updating bay' },
            { status: 500 }
        );
    }
}
