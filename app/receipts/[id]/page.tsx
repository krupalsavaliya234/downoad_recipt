'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import { IReceipt } from '@/models/Receipt';
import { ReceiptView } from '@/components/ReceiptView';

export default function ShowReceiptPage() {
    const params = useParams();
    const router = useRouter();
    const [receipt, setReceipt] = useState<IReceipt | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [generatingPdf, setGeneratingPdf] = useState(false);
    const receiptRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getData = async () => {
            const { id } = params;
            if (id) {
                await fetchReceipt(id as string);
            }
        }
        getData();
    }, [params.id]);

    const fetchReceipt = async (id: string) => {
        try {
            const res = await fetch(`/api/receipts/${id}`);
            const data = await res.json();
            if (data.success) {
                setReceipt(data.data);
            } else {
                setError(data.error || 'Receipt not found');
            }
        } catch (err) {
            setError('An error occurred while fetching the receipt');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        if (!receipt || !receiptRef.current) return;
        setGeneratingPdf(true);

        try {
            // Dynamic import for client-side only library
            const html2pdf = (await import('html2pdf.js')).default;

            const element = receiptRef.current;
            const opt: any = {
                margin: [0, 0, 0, 0], // Top, Left, Bottom, Right
                filename: `receipt_${receipt.receiptNo}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            await html2pdf().set(opt).from(element).save();
        } catch (err) {
            console.error('PDF generation failed', err);
            alert('Failed to generate PDF');
        } finally {
            setGeneratingPdf(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !receipt) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-red-50 p-4 rounded-md mb-4">
                    <p className="text-red-700">{error || 'Receipt not found'}</p>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Receipts
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0 pb-12">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-300 text-sm font-medium"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to List
                </button>

                <button
                    onClick={handleDownloadPdf}
                    disabled={generatingPdf}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium disabled:opacity-70"
                >
                    {generatingPdf ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4 mr-2" />
                    )}
                    {generatingPdf ? 'Generating PDF...' : 'Download PDF'}
                </button>
            </div>

            {/* Receipt Preview */}
            <div className="bg-gray-100 p-8 rounded-lg shadow-inner overflow-auto">
                <div className="shadow-lg mx-auto bg-white max-w-[8.5in] min-h-[11in]">
                    {/* The actual printable component */}
                    <ReceiptView ref={receiptRef} receipt={receipt} />
                </div>
            </div>
        </div>
    );
}
