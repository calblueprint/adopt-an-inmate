'use client';

import type { Option } from '@/components/Dropdown';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Dropdown from '@/components/Dropdown';
import { useProfile } from '@/contexts/ProfileProvider';
import { statesDropdownOptions } from '@/data/states';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Profile } from '@/types/schema';
import { Textbox } from '../Textbox';

interface EditProfileFormProps {
  profile: Profile;
  onClose: () => void;
}
interface EditProfileFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  pronouns: string;
  state: string;
  veteran_status: string;
}
interface FieldWrapperProps {
  label: string;
  children: React.ReactNode;
}

function FieldWrapper({ label, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-transparent bg-gray-100 px-3 py-2 focus-within:border-black">
      <span className="pl-1 text-[11px] text-black">{label}</span>

      {children}
    </div>
  );
}

export default function EditProfileForm({
  profile,
  onClose,
}: EditProfileFormProps) {
  const supabase = getSupabaseBrowserClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loadProfile } = useProfile();

  const currentDate = new Date();
  const date = currentDate.toISOString().split('T')[0];

  const { control, register, handleSubmit } = useForm<EditProfileFormData>({
    defaultValues: {
      first_name: profile.first_name ?? '',
      last_name: profile.last_name ?? '',
      date_of_birth: profile.date_of_birth,
      pronouns: profile.pronouns,
      state: profile.state?.toLowerCase(),
      veteran_status: profile.veteran_status ? 'yes' : 'no',
    },
  });

  const PRONOUNS_OPTIONS: Option[] = [
    { label: 'he/him', value: 'he/him' },
    { label: 'she/her', value: 'she/her' },
    { label: 'they/them', value: 'they/them' },
  ];

  const VETERAN_OPTIONS: Option[] = [
    { label: 'Yes, I am a veteran.', value: 'yes' },
    { label: 'No, I am not a veteran.', value: 'no' },
  ];

  const onSubmit = async (data: EditProfileFormData) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('adopter_profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          date_of_birth: data.date_of_birth,
          pronouns: data.pronouns,
          state: data.state,
          veteran_status: data.veteran_status === 'yes',
        })
        .eq('user_id', profile.user_id);

      if (error) throw error;
      await loadProfile();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      {/* First Name */}
      <FieldWrapper label="First Name">
        <Textbox
          variant="borderless"
          placeholder="First Name"
          {...register('first_name')}
        />
      </FieldWrapper>
      {/* Last Name */}
      <FieldWrapper label="Last Name">
        <Textbox
          variant="borderless"
          placeholder="Last Name"
          {...register('last_name')}
        />
      </FieldWrapper>
      {/* Date of Birth */}
      <FieldWrapper label="Date of Birth">
        <Textbox
          variant="borderless"
          type="date"
          max={date}
          min="1900-01-01"
          {...register('date_of_birth')}
        />
      </FieldWrapper>
      {/* Pronouns */}
      <Controller
        name="pronouns"
        control={control}
        render={({ field }) => (
          <FieldWrapper label="Pronouns">
            <Dropdown
              value={field.value}
              onChange={field.onChange}
              options={PRONOUNS_OPTIONS}
              placeholder={profile.pronouns}
              variant="borderless"
            />
          </FieldWrapper>
        )}
      />
      {/* State */}
      <Controller
        name="state"
        control={control}
        render={({ field }) => (
          <FieldWrapper label="State">
            <Dropdown
              value={field.value}
              onChange={field.onChange}
              options={statesDropdownOptions}
              placeholder={profile.state}
              variant="borderless"
            />
          </FieldWrapper>
        )}
      />
      {/* Veteran Status */}
      <Controller
        name="veteran_status"
        control={control}
        render={({ field }) => (
          <FieldWrapper label="Veteran Status">
            <Dropdown
              value={field.value}
              onChange={field.onChange}
              options={VETERAN_OPTIONS}
              placeholder={
                profile.veteran_status
                  ? 'Yes, I am a veteran'
                  : 'No, I am not a veteran'
              }
              variant="borderless"
            />
          </FieldWrapper>
        )}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={loading}
          className="rounded-[10px] bg-black px-8 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Confirm'}
        </button>
      </div>
    </form>
  );
}
