import '../styles/globals.css';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for API calls */}
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_BASE_URL || ''} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
