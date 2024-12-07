import '../styles/globals.css';
import { Great_Vibes, Cormorant_Garamond } from 'next/font/google';

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
});

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-cormorant',
});

export const metadata = {
  title: 'Kenneth & Jenna Wedding',
  description: 'RSVP to our wedding celebration!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${greatVibes.variable} ${cormorant.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
