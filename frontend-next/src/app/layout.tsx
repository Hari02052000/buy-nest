import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/app/globals.css';
import { env } from '@/lib/env';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';

export const metadata: Metadata = {
  title: {
    default: 'Buy Nest',
    template: '%s | Buy Nest',
  },
  description: 'Buy Nest - Premium e-commerce experience',
  openGraph: {
    title: 'Buy Nest',
    description: 'Premium e-commerce experience',
    type: 'website',
  },
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Buy Nest',
      url: 'https://buynest.com',
      logo: 'https://buynest.com/logo.png',
      sameAs: [],
    }),
  },
};

void env;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
