import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import NextLoader from './_components/NextLoader';
import NUIProvider from './_components/NUIProvider';
config.autoAddCss = false;

const inter = Poppins({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'POS',
  description: 'POS by Lastation',
  icons: {
    icon: '/iconLastation.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-poslight h-screen'}>
        <NUIProvider>
          <NextLoader />
          {children}
        </NUIProvider>
      </body>
    </html>
  );
}
