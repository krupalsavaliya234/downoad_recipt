import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Receipt from '@/models/Receipt';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const query: any = {};

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const receipts = await Receipt.find(query).sort({ createdAt: -1 }).lean();

        // Convert _id to string for client-side compatibility
        const serializedReceipts = receipts.map(receipt => ({
            ...receipt,
            _id: receipt._id.toString(),
        }));

        return NextResponse.json({ success: true, data: serializedReceipts });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Basic validation could go here, but Mongoose also handles it.
        // Check for duplicate receiptNo manually if needed to return cleaner error
        const existing = await Receipt.findOne({ receiptNo: body.receiptNo });
        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Receipt number must be unique' },
                { status: 400 }
            );
        }

        const receipt = await Receipt.create(body);

        // Convert to plain object with _id as string
        const serializedReceipt = {
            ...receipt.toObject(),
            _id: receipt._id.toString(),
        };

        return NextResponse.json({ success: true, data: serializedReceipt }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
