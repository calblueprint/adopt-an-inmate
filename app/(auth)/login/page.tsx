'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/actions/supabase/client';
import CustomLink from '@/components/CustomLink';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [isSignUp, setIsSignUp] = useState(false); // toggle between sign in / sign up, not used for now
  const router = useRouter();

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.code?.includes('invalid_credentials')) {
        alert('Invalid login credentials. Please try again.');
      } else {
        alert(`Error signing in user: ${error.message}`); // in case there are other errors
      }
    } else {
      console.log('User signed in successfully:', data);
      router.push('/');
    }

    return data;
  };

  return (
    <div className="mx-auto mt-24 flex max-w-md flex-col gap-8 rounded-lg border border-gray-300 p-8 shadow-lg">
      <h2>Login</h2>
      <CustomLink href="/">← Back to Home</CustomLink>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
}
