import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Receipt from '@/models/Receipt';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const receipt = await Receipt.findById(id);

        if (!receipt) {
            return NextResponse.json(
                { success: false, error: 'Receipt not found' },
                { status: 404 }
            );
        }

        // Convert to plain object with _id as string
        const serializedReceipt = {
            ...receipt.toObject(),
            _id: receipt._id.toString(),
        };

        return NextResponse.json({ success: true, data: serializedReceipt });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
