
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

const inter = Poppins({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'POS',
  description: 'POS by PPLS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
