'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertProfile } from '@/actions/queries/profile';
import { Button } from '@/components/Button';
import CustomLink from '@/components/CustomLink';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [pronouns, setPronouns] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [veteranStatus, setVeteranStatus] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser(); // Here is where we get the user ID

      if (user == null) {
        alert("You shouldn't be here, Jinkang should redirect you.");
        return;
      }

      // Create the profile object
      const profile = {
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
        email: email,
        date_of_birth: new Date(dateOfBirth),
        pronouns: pronouns,
        state: state,
        veteran_status: veteranStatus,
      };

      // Insert directly
      upsertProfile(profile);

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
