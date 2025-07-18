import { Poppins, Work_Sans } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import { Toaster } from 'react-hot-toast';

import ServiceWorkerRegistration from '@/components/features/ServiceWorkerRegistration';
import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const workSans = Work_Sans({
  variable: '--font-work-sans',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${workSans.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ServiceWorkerRegistration />
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
