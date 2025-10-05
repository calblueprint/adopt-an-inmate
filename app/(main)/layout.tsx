import { redirect } from 'next/navigation';

// change this to test
const isLoggedIn = true;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // handle auth logic
  if (!isLoggedIn) return redirect('/login');

  return children;
}
