import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { BackgroundProvider } from '../components/backgrounds/BackgroundProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Multi Themes with Backgrounds',
  description: 'Next.js app with theme and background switching',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-[100svh] ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="light"
          enableColorScheme
          themes={[
            'light',
            'dark-classic',
            'tangerine',
            'dark-tangerine',
            'mint',
            'dark-mint',
          ]}
        >
          <BackgroundProvider>{children}</BackgroundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
