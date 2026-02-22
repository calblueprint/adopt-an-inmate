// 'use client';

// import { useState } from 'react';
// import { LuCake, LuMapPin, LuUser } from 'react-icons/lu';
// import Logger from '@/actions/logging';
// import { Button } from '@/components/Button';
// import MobileMatchingCard from '@/components/MobileMatchingCard';
// import MobilePopUp from '@/components/MobilePopUp';
// import { useApplicationContext } from '@/contexts/ApplicationContext';
// import useMediaQuery from '@/hooks/useMediaQuery';
// import { RankedAdopteeMatch } from '@/types/schema';
// import MatchingCard from './MatchingCard';

// interface MatchingSelectScreenProps {
//   onTransitionToReview: (rankedIds: string[]) => void;
// }

// export default function MatchingSelectScreen({
//   onTransitionToReview,
// }: MatchingSelectScreenProps) {
//   const { appState } = useApplicationContext();
//   const [rankedIds, setRankedIds] = useState<string[]>([]);
//   const isMobile = useMediaQuery('(max-width: 640px)');
//   const [isRankingOpen, setIsRankingOpen] = useState(false);
//   const [selectedMatch, setSelectedMatch] = useState<RankedAdopteeMatch | null>(
//     null,
//   );

//   /**
//    * Toggles the rank of an adoptee.
//    * If ranked, removes it from rankedIds.
//    * If unranked, adds it to the end of rankedIds.
//    */
//   const handleRankToggle = (id: string) => {
//     setRankedIds(prev => {
//       const index = prev.indexOf(id);
//       return index > -1
//         ? prev.filter(rankedId => rankedId !== id)
//         : [...prev, id];
//     });
//   };

//   const handleReadMore = (match: RankedAdopteeMatch) => {
//     setSelectedMatch(match);
//     setIsRankingOpen(true);
//   };

//   const handleNextClick = async () => {
//     if (!appState.matches) {
//       Logger.error(
//         `Failed to fetch matches for application: ${appState.appId}`,
//       );
//       return;
//     }
//     onTransitionToReview(rankedIds);
//   };

//   const isNextDisabled = rankedIds.length !== 4;

//   if (isMobile) {
//     return (
//       <div className="flex w-full flex-col gap-12 pt-8">
//         <div className="flex flex-col items-center gap-4">
//           <h1>Rank your preferences!</h1>
//           <p className="w-[clamp(300px,60%,400px)] text-center text-sm text-gray-11">
//             Click the cards in your order of preference.
//           </p>
//         </div>

//         <div className="grid w-full grid-cols-2 gap-4 px-4">
//           {appState.matches?.map(m => {
//             const rankIndex = rankedIds.indexOf(m.id);
//             const currentRank = rankIndex > -1 ? rankIndex + 1 : undefined;

//             return (
//               <MobileMatchingCard
//                 key={m.id}
//                 match={m}
//                 rank={currentRank}
//                 onSelect={handleRankToggle}
//                 onReadMore={handleReadMore}
//               />
//             );
//           })}
//         </div>

//         <div className="flex w-full justify-center">
//           <Button
//             type="button"
//             variant="primary"
//             className="w-9/10 py-2 sm:w-[clamp(200px,50%,400px)]"
//             disabled={isNextDisabled}
//             onClick={handleNextClick}
//           >
//             Next
//           </Button>
//         </div>

//         <MobilePopUp
//           open={isRankingOpen}
//           onClose={() => setIsRankingOpen(false)}
//           title={selectedMatch?.first_name}
//         >
//           {selectedMatch && (
//             <div className="flex flex-col gap-3 overflow-x-hidden">
//               <div className="flex flex-wrap items-center gap-3 font-['Golos_Text'] text-[0.875rem] font-normal text-black">
//                 <div className="flex items-center gap-1">
//                   <LuCake size={13} className="text-red-12" />
//                   <span>{selectedMatch.age}</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <LuUser size={13} className="text-red-12" />
//                   <span className="capitalize">{selectedMatch.gender}</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <LuMapPin size={13} className="text-red-12" />
//                   <span>{selectedMatch.state}</span>
//                 </div>
//               </div>

//               <div className="w-[16.57806rem] font-['Golos_Text'] text-[0.75rem] font-semibold text-[#BABBC7]">
//                 Biography
//               </div>

//               <p className="font-['Golos_Text'] text-[0.875rem] font-normal whitespace-pre-line text-[#1E1F24]">
//                 {selectedMatch.bio}
//               </p>
//             </div>
//           )}
//         </MobilePopUp>
//       </div>
//     );
//   }

//   return (
//     <div className="flex w-full flex-col gap-12 pt-8">
//       <div className="flex flex-col items-center gap-4">
//         <h1>Rank your preferences!</h1>
//         <p className="w-[clamp(300px,60%,400px)] text-center text-sm text-gray-11">
//           Click the cards in your order of preference.
//         </p>
//       </div>

//       <div className="flex flex-col gap-4">
//         <div className="flex w-full gap-8 px-12">
//           {appState.matches?.map(m => {
//             const rankIndex = rankedIds.indexOf(m.id);
//             const currentRank = rankIndex > -1 ? rankIndex + 1 : undefined;

//             return (
//               <MatchingCard
//                 key={m.id}
//                 match={m}
//                 rank={currentRank}
//                 onSelect={handleRankToggle}
//               />
//             );
//           })}
//         </div>
//       </div>

//       <div className="flex w-full justify-center">
//         <Button
//           type="button"
//           variant="primary"
//           className="w-9/10 py-2 sm:w-[clamp(200px,50%,400px)]"
//           disabled={isNextDisabled}
//           onClick={handleNextClick}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import Logger from '@/actions/logging';
import MobileMatchingSelectScreen from '@/components/application/matching/MobileMatchingSelectScreen';
import { Button } from '@/components/Button';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import useMediaQuery from '@/hooks/useMediaQuery';
import { RankedAdopteeMatch } from '@/types/schema';
import MatchingCard from './MatchingCard';

interface MatchingSelectScreenProps {
  onTransitionToReview: (rankedIds: string[]) => void;
}

export default function MatchingSelectScreen({
  onTransitionToReview,
}: MatchingSelectScreenProps) {
  const { appState } = useApplicationContext();
  const [rankedIds, setRankedIds] = useState<string[]>([]);
  const isMobile = useMediaQuery('(max-width: 640px)');
  console.log('[MatchingSelectScreen] mode:', isMobile ? 'mobile' : 'desktop');
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<RankedAdopteeMatch | null>(
    null,
  );

  const handleRankToggle = (id: string) => {
    setRankedIds(prev => {
      const index = prev.indexOf(id);
      return index > -1
        ? prev.filter(rankedId => rankedId !== id)
        : [...prev, id];
    });
  };

  const handleReadMore = (match: RankedAdopteeMatch) => {
    setSelectedMatch(match);
    setIsRankingOpen(true);
  };

  const handleNextClick = async () => {
    if (!appState.matches) {
      Logger.error(
        `Failed to fetch matches for application: ${appState.appId}`,
      );
      return;
    }
    onTransitionToReview(rankedIds);
  };

  const isNextDisabled = rankedIds.length !== 4;

  if (isMobile) {
    return (
      <MobileMatchingSelectScreen
        matches={appState.matches ?? []}
        rankedIds={rankedIds}
        isNextDisabled={isNextDisabled}
        selectedMatch={selectedMatch}
        isRankingOpen={isRankingOpen}
        onRankToggle={handleRankToggle}
        onReadMore={handleReadMore}
        onNextClick={handleNextClick}
        onClosePopUp={() => setIsRankingOpen(false)}
      />
    );
  }

  return (
    <div className="flex w-full flex-col gap-12 pt-8">
      <div className="flex flex-col items-center gap-4">
        <h1>Rank your preferences!</h1>
        <p className="w-[clamp(300px,60%,400px)] text-center text-sm text-gray-11">
          Click the cards in your order of preference.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex w-full gap-8 px-12">
          {appState.matches?.map(m => {
            const rankIndex = rankedIds.indexOf(m.id);
            const currentRank = rankIndex > -1 ? rankIndex + 1 : undefined;

            return (
              <MatchingCard
                key={m.id}
                match={m}
                rank={currentRank}
                onSelect={handleRankToggle}
              />
            );
          })}
        </div>
      </div>

      <div className="flex w-full justify-center">
        <Button
          type="button"
          variant="primary"
          className="w-9/10 py-2 sm:w-[clamp(200px,50%,400px)]"
          disabled={isNextDisabled}
          onClick={handleNextClick}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
