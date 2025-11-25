'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { statesDropdownOptions } from '@/data/states';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Profile } from '@/types/schema';
import Checkbox from './Checkbox';
import { Textbox } from './Textbox';

interface EditProfileFormProps {
  profile: Profile;
}

interface EditProfileFormData {
  first_name: string;
  last_name: string;
  state: { label: string; value: string } | null;
  veteran_status: boolean;
}

export default function EditProfileForm({ profile }: EditProfileFormProps) {
  const supabase = getSupabaseBrowserClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit } = useForm<EditProfileFormData>({
    defaultValues: {
      first_name: profile?.first_name ?? '',
      last_name: profile?.last_name ?? '',
      state: profile?.state
        ? (statesDropdownOptions.find(
            s => s.value === profile.state.toLowerCase(),
          ) ?? null)
        : null,
      veteran_status: profile?.veteran_status ?? false,
    },
  });

  const onSubmit = async (data: EditProfileFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('adopter_profiles') // table name
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          state: data.state?.label ?? '',
          veteran_status: data.veteran_status,
        })
        .eq('user_id', profile.user_id);

      if (error) throw error;
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-80 flex-col gap-3"
    >
      <Controller
        name="first_name"
        control={control}
        render={({ field }) => <Textbox {...field} placeholder="First Name" />}
      />

      <Controller
        name="last_name"
        control={control}
        render={({ field }) => <Textbox {...field} placeholder="Last Name" />}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="state" className="text-sm text-gray-700">
          State
        </label>
        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={statesDropdownOptions}
              placeholder="Select a state"
              className="text-sm"
            />
          )}
        />
      </div>

      <label className="flex items-center gap-2">
        <Controller
          name="veteran_status"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={!!field.value}
              onChange={e => field.onChange(e.target.checked)}
            />
          )}
        />
        Veteran
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save'}
      </button>

      {success && <p className="text-green-600">Profile updated!</p>}
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
