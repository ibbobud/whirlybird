import { NextRequest, NextResponse } from 'next/server';
import { readExcelFile, writeExcelFile, BayData } from '../../utils/excel';

export async function PUT(request: Request) {
    try {
        const updatedBay: BayData = await request.json();
        
        // Validate the incoming data
        if (!updatedBay || !updatedBay.bayNumber || !updatedBay.serialNumber || 
            !updatedBay.customerName || typeof updatedBay.rank !== 'number' || 
            typeof updatedBay.hangar !== 'number') {
            return NextResponse.json(
                { error: 'Invalid bay data. Missing required fields.' },
                { status: 400 }
            );
        }

        // Read current data
        const bays = await readExcelFile();

        // Find and update the bay - checking bayNumber AND hangar
        const bayIndex = bays.findIndex(b => 
            b.bayNumber === updatedBay.bayNumber && 
            b.hangar === updatedBay.hangar
        );

        if (bayIndex === -1) {
            // If bay doesn't exist for this hangar, add it
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
