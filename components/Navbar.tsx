import Link from 'next/link';
import { Receipt } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <Receipt className="h-8 w-8 text-blue-600 mr-2" />
                            <span className="font-bold text-xl text-gray-900">ReceiptGen</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            All Receipts
                        </Link>
                        <Link
                            href="/create"
                            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                        >
                            New Receipt
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
