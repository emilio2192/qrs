import './globals.css';
import { Roboto } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from './components/Header';

const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'QRS',
  description: 'QRS Shopping Cart System',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body className={roboto.className}>
        <NextIntlClientProvider messages={messages}>
          <Header cartCount={0} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
