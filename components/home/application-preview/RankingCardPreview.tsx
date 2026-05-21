import { LuCake, LuGlobe, LuUser } from 'react-icons/lu';
import { stateNameAbbv } from '@/data/states';

interface RankingCardPreviewProps {
  idx: number;
  age: number | string;
  state: string | null;
  gender: string | null;
  firstName: string | null;
}

export default function RankingCardPreview({
  age,
  gender,
  idx,
  state,
  firstName,
}: RankingCardPreviewProps) {
  return (
    <div className="flex gap-4 rounded-lg bg-gray-3/80 p-4">
      <div className="flex flex-col">
        <div className="grid size-6 place-items-center rounded-full bg-black text-xs font-medium text-white">
          {idx + 1}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-medium">{firstName}</p>
        <div className="flex items-center gap-2">
          {/* age */}
          <div className="flex items-center gap-1">
            <div className="rounded-full bg-red-3 p-1 text-red-9">
              <LuCake />
            </div>
            <p className="text-sm">{age}</p>
          </div>
          {/* state */}
          <div className="flex items-center gap-1">
            <div className="rounded-full bg-red-3 p-1 text-red-9">
              <LuGlobe />
            </div>
            <p className="text-sm">
              {state ? stateNameAbbv[state.toLowerCase()] : 'N/A'}
            </p>
          </div>
          {/* gender */}
          <div className="flex items-center gap-1">
            <div className="rounded-full bg-red-3 p-1 text-red-9">
              <LuUser />
            </div>
            <p className="text-sm">{gender}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
