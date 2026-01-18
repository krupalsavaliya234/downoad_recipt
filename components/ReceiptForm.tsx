'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';

interface ReceiptItem {
    description: string;
    quantity: number;
    chalNo: string;
    rate: number;
    amount: number;
}

export default function ReceiptForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        receiptNo: '',
        customerName: '',
        date: new Date().toISOString().split('T')[0],
        address: '',
    });

    const [items, setItems] = useState<ReceiptItem[]>([
        { description: '', quantity: 0, chalNo: '', rate: 0, amount: 0 },
    ]);

    // Fetch next receipt number on component mount
    useEffect(() => {
        const fetchNextReceiptNumber = async () => {
            try {
                const res = await fetch('/api/receipts/next-number');
                const data = await res.json();
                if (data.success) {
                    setFormData((prev) => ({ ...prev, receiptNo: data.data.nextNumber }));
                }
            } catch (err) {
                console.error('Failed to fetch next receipt number:', err);
            }
        };
        fetchNextReceiptNumber();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (
        index: number,
        field: keyof ReceiptItem,
        value: string | number
    ) => {
        const newItems = [...items];
        const item = { ...newItems[index] };

        // Update field
        if (field === 'description' || field === 'chalNo') {
            // @ts-ignore
            item[field] = value as string;
        } else {
            // @ts-ignore
            item[field] = Number(value);
        }

        // Auto-calculate amount
        if (field === 'quantity' || field === 'rate') {
            item.amount = item.quantity * item.rate;
        }

        newItems[index] = item;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([
            ...items,
            { description: '', quantity: 0, chalNo: '', rate: 0, amount: 0 },
        ]);
    };

    const removeItem = (index: number) => {
        if (items.length === 1) return;
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + item.amount, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.receiptNo || !formData.customerName) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                items,
                totalAmount: calculateTotal(),
            };

            const res = await fetch('/api/receipts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create receipt');
            }

            router.push(`/receipts/${data.data._id}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Receipt Details</h2>
            </div>

            {error && (
                <div className="bg-red-50 p-4 rounded-md text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Bill No. <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="receiptNo"
                        value={formData.receiptNo}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-gray-900"
                        placeholder="Auto-generated"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-gray-900"
                        required
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">M/s. (Customer Name) <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-gray-900"
                        placeholder="Client or Company Name"
                        required
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address (Optional)</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-gray-900"
                        placeholder="Customer Address"
                    />
                </div>
            </div>

            {/* Items Section */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Items / Services</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-2 font-medium text-sm text-gray-500 uppercase text-center">
                        <div className="col-span-1">No.</div>
                        <div className="col-span-4 text-left pl-2">Particulars</div>
                        <div className="col-span-2">Qty</div>
                        <div className="col-span-2">Chal.no.</div>
                        <div className="col-span-1">Rate</div>
                        <div className="col-span-2">Amount</div>
                    </div>

                    {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-1 text-gray-500 text-center">{index + 1}</div>
                            <div className="col-span-4">
                                <input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 sm:text-sm text-gray-900"
                                    placeholder="Particulars"
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <input
                                    type="number"
                                    min="0"
                                    value={item.quantity || ''}
                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 sm:text-sm text-gray-900"
                                    placeholder="0"
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <input
                                    type="text"
                                    value={item.chalNo || ''}
                                    onChange={(e) => handleItemChange(index, 'chalNo', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 sm:text-sm text-gray-900"
                                    placeholder="Chal.no"
                                />
                            </div>
                            <div className="col-span-1">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.rate || ''}
                                    onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 sm:text-sm text-gray-900"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div className="col-span-2 flex items-center justify-between">
                                <span className="font-medium text-gray-900 w-full text-right pr-2">
                                    {item.amount.toFixed(2)}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                    disabled={items.length === 1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={addItem}
                    className="mt-4 inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Plus className="-ml-0.5 mr-2 h-4 w-4" />
                    Add Item
                </button>
            </div>

            {/* Footer Section (Totals) */}
            <div className="border-t border-gray-200 pt-6 flex justify-end">
                <div className="w-full md:w-1/3 space-y-3">
                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                        <span>Total Amount:</span>
                        <span>RM {calculateTotal().toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="pt-6 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="-ml-1 mr-2 h-4 w-4" />
                            Save Receipt
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
