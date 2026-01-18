'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Download, Plus, FileText, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { IReceiptClient } from '@/models/Receipt';
import DateRangeModal from '@/components/DateRangeModal';

export default function Home() {
  const [receipts, setReceipts] = useState<IReceiptClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const res = await fetch('/api/receipts');
      const data = await res.json();
      if (data.success) {
        setReceipts(data.data);
      } else {
        setError(data.error || 'Failed to fetch receipts');
      }
    } catch (err) {
      setError('An error occurred while fetching receipts');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (startDate: string, endDate: string) => {
    console.log('handleExport called with:', { startDate, endDate });
    try {
      // Fetch filtered data based on date range
      const url = `/api/receipts?startDate=${startDate}&endDate=${endDate}`;
      console.log('Fetching from:', url);
      const res = await fetch(url);
      const data = await res.json();
      console.log('API Response:', data);

      if (!data.success || !data.data.length) {
        console.warn('No data found or API error');
        alert('No receipts found for the selected date range.');
        setIsExportModalOpen(false);
        return;
      }

      // Prepare data for Excel
      const exportData = data.data.map((r: any) => ({
        'Receipt No': r.receiptNo,
        'Date': format(new Date(r.date), 'yyyy-MM-dd'),
        'Customer Name': r.customerName,
        'Address': r.address || '',
        'Total Amount': r.totalAmount,
        'Created At': format(new Date(r.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      }));

      console.log('Prepared export data:', exportData);

      // Create Worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Receipts');

      // Generate Excel File
      console.log('Writing Excel file...');
      XLSX.writeFile(workbook, `receipts_${startDate}_to_${endDate}.xlsx`);
      console.log('Excel file written successfully');

      setIsExportModalOpen(false);
    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to export data');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receipts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your customer receipts</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <Link
            href="/create"
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Receipt
          </Link>
        </div>
      </div>

      <DateRangeModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />

      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Receipt No
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {receipts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-lg font-medium text-gray-900">No receipts found</p>
                    <p className="text-sm text-gray-500">Get started by creating a new receipt.</p>
                  </td>
                </tr>
              ) : (
                receipts.map((receipt) => (
                  <tr
                    key={String(receipt._id)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link href={`/receipts/${String(receipt._id)}`} className="block">
                        #{receipt.receiptNo}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link href={`/receipts/${String(receipt._id)}`} className="block">
                        {receipt.customerName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link href={`/receipts/${String(receipt._id)}`} className="block">
                        {format(new Date(receipt.date), 'MMM dd, yyyy')}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      <Link href={`/receipts/${String(receipt._id)}`} className="block">
                        RM {receipt.totalAmount.toFixed(2)}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/receipts/${String(receipt._id)}`}
                        className="text-blue-600 hover:text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
