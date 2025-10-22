import '../styles/globals.css';
import localFont from 'next/font/local';

// Load custom Great Vibes font for headers
const greatVibes = localFont({
  src: './fonts/GreatVibes-Regular.ttf',
  variable: '--font-great-vibes',
  display: 'swap',
});

export const metadata = {
  title: 'Kenneth & Jenna Wedding',
  description: 'RSVP to our wedding celebration!',
  keywords: 'wedding, rsvp, Kenneth, Jenna, invitation',
  openGraph: {
    title: 'Kenneth & Jenna Wedding',
    description: 'RSVP to our wedding celebration!',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={greatVibes.variable}>
      <head>
        {/* Preconnect to Google Fonts for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for API calls */}
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_BASE_URL || ''} />
      </head>
      <body suppressHydrationWarning className={greatVibes.variable}>{children}</body>
    </html>
  );
}
