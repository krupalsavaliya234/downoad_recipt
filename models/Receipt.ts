import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReceiptItem {
    description: string;
    quantity: number;
    chalNo?: string;
    rate: number;
    amount: number;
}

export interface IReceipt extends Document {
    receiptNo: string;
    customerName: string;
    date: Date;
    address?: string;
    items: IReceiptItem[];
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

const ReceiptItemSchema = new Schema<IReceiptItem>({
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    chalNo: { type: String },
    rate: { type: Number, required: true },
    amount: { type: Number, required: true },
});

const ReceiptSchema = new Schema<IReceipt>(
    {
        receiptNo: { type: String, required: true, unique: true },
        customerName: { type: String, required: true },
        date: { type: Date, required: true },
        address: { type: String },
        items: [ReceiptItemSchema],
        totalAmount: { type: Number, required: true },
    },
    { timestamps: true }
);

// Prevent overwriting model during hot reload
const Receipt: Model<IReceipt> =
    mongoose.models.Receipt || mongoose.model<IReceipt>('Receipt', ReceiptSchema);

export default Receipt;
