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

        return NextResponse.json({ success: true, data: receipt });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
