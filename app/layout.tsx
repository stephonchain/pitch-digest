import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pitch Digest - Turn YouTube Videos into 5-Point Summaries',
  description: 'Instantly transform any YouTube video into concise, timestamped summaries. Perfect for entrepreneurs and knowledge workers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}