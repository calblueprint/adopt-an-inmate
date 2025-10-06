'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/actions/supabase/client';
import CustomLink from '@/components/CustomLink';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [isSignUp, setIsSignUp] = useState(false); // toggle between sign in / sign up, not used for now
  const router = useRouter();

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.code?.includes('email_exists')) {
        throw new Error('This email is already registered');
      } else {
        alert(`Error signing up user: ${error.message}`);
      }
    } else {
      console.log('User signed up successfully:', data);
    }

    router.push('/');

    return data;
  };

  return (
    <div className="mx-auto mt-24 flex max-w-md flex-col gap-8 rounded-lg border border-gray-300 p-8 shadow-lg">
      <h2>Sign Up Page</h2>
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

      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );

  // return (
  //   <div className="flex h-full w-full flex-col items-center justify-center">
  //     <CustomLink href="/">← Back to Home</CustomLink>
  //     <div className="text-center">Sign up page</div>
  //   </div>
  // );
}
