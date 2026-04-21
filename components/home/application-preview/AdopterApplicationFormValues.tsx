import { formatAgePreference, formatGenderPreference } from '@/lib/formatters';
import { ApplicationWithAdoptees } from '@/types/schema';

export function AdopterApplicationFormValues({
  appData,
}: {
  appData: ApplicationWithAdoptees;
}) {
  if (!appData) return null;

  return (
    <>
      {/* bio */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold text-gray-9">Your Biography</p>
        <p>{appData.personal_bio}</p>
      </div>

      {/* gender preference */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold text-gray-9">Gender Preference</p>
        <p>{formatGenderPreference(appData.gender_pref)}</p>
      </div>

      {/* age preference */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold text-gray-9">Age Preference</p>
        <p>{formatAgePreference(appData.age_pref)}</p>
      </div>
    </>
  );
}
