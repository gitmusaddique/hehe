import { useCallback } from "react";

export function useHaptic() {
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    // Simulate haptic feedback with visual feedback
    // In a real app, this would use the Vibration API
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  return { triggerHaptic };
}
