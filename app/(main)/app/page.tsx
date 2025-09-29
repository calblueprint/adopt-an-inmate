import { redirect } from 'next/navigation';

export default function RedirectToHome() {
  return redirect('/');
}
