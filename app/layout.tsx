import type { Metadata } from 'next';
import { Golos_Text } from 'next/font/google';
import localFont from 'next/font/local';
import '@/styles/global.css';
import OnboardingGuard from '@/components/OnboardingGuard';
import { AuthProvider } from '@/contexts/AuthProvider';
import ProfileProvider from '@/contexts/ProfileProvider';
import { cn } from '@/lib/utils';

// font definitions
const bespoke = localFont({
  src: [
    {
      path: '../assets/fonts/BespokeSans-Variable.ttf',
      style: 'normal',
    },
    {
      path: '../assets/fonts/BespokeSans-VariableItalic.ttf',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-bespoke',
});

const golos = Golos_Text({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-golos',
});

// site metadata - what shows up on embeds
export const metadata: Metadata = {
  title: 'Project Name',
  description: 'Description of project',
};

{
  /* <OnboardingGuard>
            <ProfileProvider>{children}</ProfileProvider>
          </OnboardingGuard> */
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(bespoke.variable, golos.variable, 'h-svh w-full bg-bg')}
      >
        <AuthProvider>
          <ProfileProvider>{children}</ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
