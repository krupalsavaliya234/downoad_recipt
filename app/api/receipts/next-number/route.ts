import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Receipt from '@/models/Receipt';

export async function GET() {
    try {
        await dbConnect();

        // Find the receipt with the highest receiptNo
        const lastReceipt = await Receipt.findOne()
            .sort({ receiptNo: -1 })
            .select('receiptNo')
            .lean();

        let nextNumber = 1;

        if (lastReceipt && lastReceipt.receiptNo) {
            // Parse the receiptNo as a number and increment
            const currentNumber = parseInt(lastReceipt.receiptNo, 10);
            if (!isNaN(currentNumber)) {
                nextNumber = currentNumber + 1;
            }
        }

        return NextResponse.json({
            success: true,
            data: { nextNumber: nextNumber.toString() }
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
