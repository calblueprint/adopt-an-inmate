'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTimerProps {
  initialCooldown?: number;
  cooldowns: number[];
  onFinish?: () => unknown;
}

export const useTimer = ({
  initialCooldown = 0,
  cooldowns,
  onFinish,
}: UseTimerProps) => {
  const [cooldownSeconds, setCooldownSeconds] = useState(initialCooldown);
  const timer = useRef<NodeJS.Timeout>(null);
  const cooldownSecondsRef = useRef(initialCooldown);
  const numTries = useRef(0);

  const timerFunction = useCallback(() => {
    cooldownSecondsRef.current = Math.max(cooldownSecondsRef.current - 1, 0);
    setCooldownSeconds(cooldownSecondsRef.current);

    // clear timer
    if (cooldownSecondsRef.current === 0) {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;

      onFinish?.();
    }
  }, [onFinish]);

  const startTimerHelper = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(timerFunction, 1000);
  }, [timerFunction]);

  // initialize timer
  useEffect(() => {
    if (initialCooldown === 0) return;
    startTimerHelper();
    return () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
    };
  }, [startTimerHelper, initialCooldown]);

  const startTimer = useCallback(() => {
    const cooldown =
      cooldowns[Math.min(numTries.current, cooldowns.length - 1)];
    numTries.current++;

    cooldownSecondsRef.current = cooldown;
    setCooldownSeconds(cooldownSecondsRef.current);

    startTimerHelper();
  }, [startTimerHelper, cooldowns]);

  return {
    cooldownSeconds,
    numTries: numTries.current,
    startTimer,
  };
};
