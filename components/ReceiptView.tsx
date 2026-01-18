'use client';

import { forwardRef } from 'react';
import { format } from 'date-fns';
import { IReceipt } from '@/models/Receipt';

interface ReceiptViewProps {
    receipt: IReceipt;
}

export const ReceiptView = forwardRef<HTMLDivElement, ReceiptViewProps>(
    ({ receipt }, ref) => {
        // Fill empty rows to make the receipt look consistent if few items
        const minRows = 12;
        const emptyRows = Math.max(0, minRows - receipt.items.length);
        const filledItems = [...receipt.items, ...Array(emptyRows).fill(null)];

        return (
            <div
                ref={ref}
                className="p-8 max-w-[8.5in] mx-auto font-sans"
                id="receipt-content"
                style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff', color: '#0070C0' }}
            >
                {/* Header */}
                <div className="text-center mb-3">
                    <h1 className="text-5xl font-extrabold tracking-tight uppercase mb-0" style={{ color: '#2F86D3' }}>
                        Kailash Industries
                    </h1>
                    <p className="text-right text-sm font-bold mt-0">(CNC Job Work)</p>
                </div>

                {/* Address */}
                <div className="mb-3 text-sm leading-tight">
                    <p>Parmeshwar Industries Area, Seri No.5, Atika Dhebar Road(south)</p>
                    <p>Rajkot(Guj.) India Mo. 97233 51323</p>
                </div>

                {/* Bill No and Date Row */}
                <div className="flex justify-between items-end mb-3">
                    <div className="flex items-end flex-grow w-1/2">
                        <span className="font-bold mr-2 whitespace-nowrap">Bill No.:</span>
                        <span className="font-bold text-xl flex-grow text-center px-2 pb-1" style={{ color: '#dc2626', borderBottom: '1px solid #0070C0' }}>
                            {receipt.receiptNo}
                        </span>
                    </div>
                    <div className="w-12"></div>
                    <div className="flex items-end flex-grow w-1/2">
                        <span className="font-bold mr-2">Date.</span>
                        <span className="flex-grow text-center px-2 pb-1" style={{ borderBottom: '1px solid #0070C0' }}>
                            {format(new Date(receipt.date), 'dd/MM/yyyy')}
                        </span>
                    </div>
                </div>

                {/* M/s (Customer) */}
                <div className="flex items-end mb-4">
                    <span className="font-bold mr-2 whitespace-nowrap">M/s.:</span>
                    <div className="flex-grow px-2 font-bold text-lg pb-1" style={{ borderBottom: '1px solid #0070C0' }}>
                        {receipt.customerName}
                        {receipt.address ? `, ${receipt.address}` : ''}
                    </div>
                </div>

                {/* Table Structure - Using Flex/Grid to simulate the exact lines */}
                <div className="mb-2" style={{ border: '2px solid #0070C0' }}>
                    {/* Table Header */}
                    <div className="flex font-bold text-center items-center" style={{ backgroundColor: '#2F86D3', color: '#ffffff', borderBottom: '1px solid #0070C0' }}>
                        <div className="w-12 p-2 pb-2" style={{ borderRight: '1px solid #ffffff' }}>No</div>
                        <div className="flex-grow p-2 pb-2" style={{ borderRight: '1px solid #ffffff' }}>Particulars</div>
                        <div className="w-16 p-2 pb-2" style={{ borderRight: '1px solid #ffffff' }}>Qty.</div>
                        <div className="w-20 p-2 pb-2" style={{ borderRight: '1px solid #ffffff' }}>Chal.no.</div>
                        <div className="w-20 p-2 pb-2" style={{ borderRight: '1px solid #ffffff' }}>Rate</div>
                        <div className="w-24 p-2 pb-2">Amount</div>
                    </div>

                    {/* Table Body */}
                    {filledItems.map((item, index) => (
                        <div key={index} className="flex relative items-stretch">

                            {/* Vertical Lines Overlay */}
                            {/* We draw the content and ensure borders are placed using inline styles */}

                            {/* No */}
                            <div className="w-12 py-2 px-1 text-center flex items-center justify-center" style={{ borderRight: '1px solid #0070C0', minHeight: '2.5rem' }}>
                                {item ? index + 1 : ''}
                            </div>

                            {/* Particulars */}
                            <div className="flex-grow py-2 px-2 flex items-center" style={{ borderRight: '1px solid #0070C0' }}>
                                {item ? item.description : ''}
                            </div>

                            {/* Qty */}
                            <div className="w-16 py-2 px-1 text-center flex items-center justify-center" style={{ borderRight: '1px solid #0070C0' }}>
                                {item ? item.quantity : ''}
                            </div>

                            {/* Chal.no */}
                            <div className="w-20 py-2 px-1 text-center flex items-center justify-center" style={{ borderRight: '1px solid #0070C0' }}>
                                {item ? (item.chalNo || '-') : ''}
                            </div>

                            {/* Rate */}
                            <div className="w-20 py-2 px-1 text-right flex items-center justify-end" style={{ borderRight: '1px solid #0070C0' }}>
                                {item ? item.rate.toFixed(2) : ''}
                            </div>

                            {/* Amount */}
                            <div className="w-24 py-2 px-1 text-right flex items-center justify-end">
                                {item ? item.amount.toFixed(2) : ''}
                            </div>

                        </div>
                    ))}

                    {/* Footer Total Row */}
                    <div className="flex" style={{ borderTop: '1px solid #0070C0' }}>
                        <div className="flex-grow p-1 text-right font-bold pr-2" style={{ borderRight: '1px solid #0070C0' }}>

                        </div>
                        <div className="w-20 font-bold text-center p-1" style={{ borderRight: '1px solid #0070C0', backgroundColor: '#2F86D3', color: '#ffffff' }}>
                            Total
                        </div>
                        <div className="w-24 p-1 text-right font-bold">
                            {receipt.totalAmount.toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Footer Signatures */}
                <div className="flex justify-between mt-8 items-end">
                    <div className="text-sm">
                        Receiver&apos;s Sign
                    </div>
                    <div className="text-sm">
                        For : Kailash Industries
                    </div>
                </div>
            </div>
        );
    }
);

ReceiptView.displayName = 'ReceiptView';
