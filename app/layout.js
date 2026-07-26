import './globals.css';
import { LanguageProvider } from '@/lib/LanguageContext';
import SWRegister from '@/components/SWRegister';

export const metadata = {
  title: 'झूलेलाल मंदिर | श्री झूलेलाल अखण्ड ज्योति ट्रस्ट, रामबाग कानपुर',
  description:
    'श्री झूलेलाल अखण्ड ज्योति ट्रस्ट, रामबाग कानपुर की आधिकारिक ऐप — आरती, वरुण चालीसा, गुज्जी देह की विधि और आध्यात्मिक नोट्स। हिंदी और सिंधी में।',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'झूलेलाल मंदिर',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport = {
  themeColor: '#B3541E',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Tiro+Devanagari+Hindi&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>
          <div className="app-bg">{children}</div>
        </LanguageProvider>
        <SWRegister />
      </body>
    </html>
  );
}
