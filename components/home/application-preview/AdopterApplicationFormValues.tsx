import { LuCake, LuGlobe, LuUser } from 'react-icons/lu';
import { stateNameAbbv } from '@/data/states';
import { formatAgePreference, formatGenderPreference } from '@/lib/formatters';
import { calculateAge } from '@/lib/utils';
import { ApplicationWithAdoptees } from '@/types/schema';

export function AdopterApplicationFormValues({
  appData,
}: {
  appData: ApplicationWithAdoptees;
}) {
  if (!appData) return null;

  return (
    <>
      {/* rankings */}
      {!appData.matched && appData.adoptees && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-10">RANKINGS</p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-2">
            {appData.adoptees.map((a, idx) => (
              <div
                key={a.id}
                className="flex gap-4 rounded-lg bg-gray-3/80 p-4"
              >
                <div className="flex flex-col">
                  <div className="grid size-6 place-items-center rounded-full bg-black text-xs font-medium text-white">
                    {idx + 1}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-medium">{a.first_name}</p>
                  <div className="flex items-center gap-2">
                    {/* age */}
                    <div className="flex items-center gap-1">
                      <div className="rounded-full bg-red-3 p-1 text-red-9">
                        <LuCake />
                      </div>
                      <p className="text-sm">
                        {a.dob ? calculateAge(a.dob) : 'N/A'}
                      </p>
                    </div>
                    {/* state */}
                    <div className="flex items-center gap-1">
                      <div className="rounded-full bg-red-3 p-1 text-red-9">
                        <LuGlobe />
                      </div>
                      <p className="text-sm">
                        {a.state ? stateNameAbbv[a.state.toLowerCase()] : 'N/A'}
                      </p>
                    </div>
                    {/* gender */}
                    <div className="flex items-center gap-1">
                      <div className="rounded-full bg-red-3 p-1 text-red-9">
                        <LuUser />
                      </div>
                      <p className="text-sm">{a.gender}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* bio */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-10">BIOGRAPHY</p>
        <p>{appData.personal_bio}</p>
      </div>

      {/* gender preference */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-10">GENDER PREFERENCE</p>
        <p>{formatGenderPreference(appData.gender_pref)}</p>
      </div>

      {/* age preference */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-10">AGE PREFERENCE</p>
        <p>{formatAgePreference(appData.age_pref)}</p>
      </div>
    </>
  );
}
