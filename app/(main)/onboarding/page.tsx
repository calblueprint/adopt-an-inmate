'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import CustomLink from '@/components/CustomLink';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { Profile } from '@/utils/schema';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [state, setState] = useState('');
  const [veteranStatus, setVeteranStatus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser(); // Here is where we get the user ID

      if (userError || !user) {
        alert('You must be logged in to complete onboarding');
        router.push('/login');
        return;
      }

      // Create the profile object
      const profile: Omit<Profile, 'user_id'> & { user_id: string } = {
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
        email: email,
        date_of_birth: new Date(dateOfBirth),
        pronouns: pronouns,
        state: state,
        veteran_status: veteranStatus,
      };

      // Insert directly using client Supabase
      const { error: insertError } = await supabase
        .from('profiles')
        .upsert(profile);

      if (insertError) {
        console.error('Error inserting profile:', insertError);
        alert(`Error saving profile: ${insertError.message}`);
        return;
      }

      // Success! Redirect to home or dashboard
      alert('Profile saved successfully!');
      router.push('/');
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <CustomLink href="/">← Go back</CustomLink>
      <p>Onboarding page</p>

      <div className="flex flex-col">
        <input
          type="firstName"
          placeholder="First name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
        <input
          type="lastName"
          placeholder="Last name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="date"
          placeholder="Date of Birth"
          value={dateOfBirth}
          onChange={e => setDateOfBirth(e.target.value)}
        />

        <input
          type="text"
          placeholder="Pronouns (e.g., she/her, he/him, they/them)"
          value={pronouns}
          onChange={e => setPronouns(e.target.value)}
        />

        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={e => setState(e.target.value)}
        />

        <div className="flex flex-row gap-3">
          <p>Veteran Status</p>
          <input
            type="checkbox"
            checked={veteranStatus}
            onChange={e => setVeteranStatus(e.target.checked)}
          />
        </div>

        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </div>
  );
}
