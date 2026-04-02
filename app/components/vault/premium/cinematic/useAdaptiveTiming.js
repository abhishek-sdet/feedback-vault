/**
 * useAdaptiveTiming
 * Calculates a timing multiplier based on text length to make animations
 * feel physical (heavier for more content).
 */
export default function useAdaptiveTiming(text) {
  const length = text?.trim().length || 0;
  
  // Base duration unit for the whole sequence (in ms)
  const base = 2400;

  // Multiplier scales from 0.8 to 1.8 based on character count
  // 100 chars = ~1.0x, 400+ chars = ~1.8x
  const multiplier = Math.min(Math.max(length / 200, 0.8), 1.8);

  return {
    multiplier,
    // When to start the folding (after crypto/ink dissolve)
    foldDelay: 1000 * multiplier,
    // When to start the descent
    dropDelay: 2200 * multiplier,
    // When to transition to the void impact
    voidDelay: 3400 * multiplier,
  };
}
