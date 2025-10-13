import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/global.css';
import localFont from 'next/font/local';
import { cn } from '@/lib/utils';

// font definitions
const sans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const bespoke = localFont({
  src: '../assets/fonts/BespokeSans-Variable.ttf',
  variable: '--font-bespokevar',
});

const golos = localFont({
  src: '../assets/fonts/GolosText-VariableFont_wght.ttf',
  variable: '--font-golosvar',
});

// site metadata - what shows up on embeds
export const metadata: Metadata = {
  title: 'Project Name',
  description: 'Description of project',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(sans.className, 'h-svh w-full')}>{children}</body>
      <body className={cn(bespoke.className, 'h-svh w-full')}>{children}</body>
      <body className={cn(golos.className, 'h-svh w-full')}>{children}</body>
    </html>
  );
}
