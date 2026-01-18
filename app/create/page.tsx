import ReceiptForm from '@/components/ReceiptForm';

export default function CreateReceiptPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Create New Receipt</h1>
                <p className="text-sm text-gray-500 mt-1">Fill in the details below to generate a new receipt.</p>
            </div>
            <ReceiptForm />
        </div>
    );
}
