
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import iconLs from '@/app/favicon.ico'
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

const inter = Poppins({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'POS',
  description: 'POS by PPLS',
  icons: {
    icon: '/iconLastation.png',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-poslight'}>
        {children}
      </body>
    </html>
  );
}
