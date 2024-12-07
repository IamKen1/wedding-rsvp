import '../styles/globals.css';
import { Dancing_Script, Poppins } from 'next/font/google';

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
});

const poppins = Poppins({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-poppins',
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
    <html lang="en" suppressHydrationWarning className={`${dancingScript.variable} ${poppins.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
