import '../styles/globals.css';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
