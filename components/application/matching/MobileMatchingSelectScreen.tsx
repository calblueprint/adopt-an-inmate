'use client';

import { useEffect, useRef, useState } from 'react';
import { LuCake, LuMapPin, LuUser } from 'react-icons/lu';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/components/Button';
import MobileMatchingCard from '@/components/MobileMatchingCard';
import MobilePopUp from '@/components/MobilePopUp';
import { RankedAdopteeMatch } from '@/types/schema';

interface MobileMatchingSelectScreenProps {
  matches: RankedAdopteeMatch[];
  rankedIds: string[];
  isNextDisabled: boolean;
  selectedMatch: RankedAdopteeMatch | null;
  isRankingOpen: boolean;
  onRankToggle: (id: string) => void;
  onRankedIdsChange: (newRankedIds: string[]) => void;
  onReadMore: (match: RankedAdopteeMatch) => void;
  onNextClick: () => void;
  onClosePopUp: () => void;
}

export default function MobileMatchingSelectScreen({
  matches: initialMatches,
  isNextDisabled,
  selectedMatch,
  isRankingOpen,
  onRankedIdsChange,
  onReadMore,
  onNextClick,
  onClosePopUp,
}: MobileMatchingSelectScreenProps) {
  // manage ordered matches internally so drag reorder updates the UI
  const [orderedMatches, setOrderedMatches] =
    useState<RankedAdopteeMatch[]>(initialMatches);

  // notify parent of initial order on mount so Next button is enabled by default
  const initialMatchesRef = useRef(initialMatches);
  useEffect(() => {
    onRankedIdsChange(initialMatchesRef.current.map(m => m.id));
  }, [onRankedIdsChange]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = orderedMatches.findIndex(m => m.id === active.id);
      const newIndex = orderedMatches.findIndex(m => m.id === over.id);
      const newOrder = arrayMove(orderedMatches, oldIndex, newIndex);
      setOrderedMatches(newOrder);
      onRankedIdsChange(newOrder.map(m => m.id));
    }
  };

  return (
    <div className="flex w-full flex-col gap-12 pt-8">
      <div className="flex flex-col items-center gap-4">
        <h1>Rank your preferences!</h1>
        <p className="w-[clamp(300px,60%,400px)] text-center text-sm text-gray-11">
          Drag the cards in your order of preferences!
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedMatches.map(m => m.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex w-full flex-col gap-3 px-4">
            {orderedMatches.map((m, idx) => (
              <MobileMatchingCard
                key={m.id}
                match={m}
                rank={idx + 1}
                onReadMore={onReadMore}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex w-full justify-center">
        <Button
          type="button"
          variant="primary"
          className="w-9/10 py-2 sm:w-[clamp(200px,50%,400px)]"
          disabled={isNextDisabled}
          onClick={onNextClick}
        >
          Next
        </Button>
      </div>

      <MobilePopUp
        open={isRankingOpen}
        onClose={onClosePopUp}
        title={selectedMatch?.first_name}
      >
        {selectedMatch && (
          <div className="flex flex-col gap-3 overflow-x-hidden">
            <div className="flex flex-wrap items-center gap-3 text-sm font-normal text-gray-12">
              <div className="flex items-center gap-1">
                <LuCake size={13} className="text-red-12" />
                <span>{selectedMatch.age}</span>
              </div>
              <div className="flex items-center gap-1">
                <LuUser size={13} className="text-red-12" />
                <span className="capitalize">{selectedMatch.gender}</span>
              </div>
              <div className="flex items-center gap-1">
                <LuMapPin size={13} className="text-red-12" />
                <span>{selectedMatch.state}</span>
              </div>
            </div>
            <div className="w-full text-xs font-semibold text-gray-8">
              Biography
            </div>
            <p className="text-sm font-normal whitespace-pre-line text-gray-12">
              {selectedMatch.bio}
            </p>
          </div>
        )}
      </MobilePopUp>
    </div>
  );
}
