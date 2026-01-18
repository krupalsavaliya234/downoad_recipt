# Receipt Generation App

A production-ready web application for generating and managing receipts, built with Next.js, MongoDB, and Tailwind CSS.

## Features

- **Create Receipts**: Professional receipt form with dynamic line items.
- **List Receipts**: searchable/filterable table view (search by date range export).
- **PDF Generation**: Pixel-perfect PDF download matching the onscreen design.
- **Excel Export**: Export receipts data to Excel (.xlsx) for specific date ranges.
- **Responsive Design**: Works on desktop and mobile.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB (Mongoose)
- **Libs**: `html2pdf.js`, `xlsx`, `lucide-react`, `date-fns`

## Getting Started

1.  **Clone the repository** (if applicable)

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory:
    ```env
    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/receipts_db?retryWrites=true&w=majority
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## Deployment

### Deploy to Vercel

1.  Push your code to a Git repository (GitHub/GitLab/Bitbucket).
2.  Import the project in Vercel.
3.  Add the `MONGO_URI` environment variable in the Vercel project settings.
4.  Deploy!

### Note on PDF Generation
This app uses client-side PDF generation (`html2pdf.js`) to ensure the PDF looks exactly like the UI component. This works seamlessly on Vercel without requiring server-side Puppeteer instances.

## Folder Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components.
- `lib/`: Utility functions and database connection.
- `models/`: Mongoose database models.
