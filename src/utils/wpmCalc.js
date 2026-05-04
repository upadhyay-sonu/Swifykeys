export const calculateWpm = (correctChars, elapsedSeconds) => {
  if (elapsedSeconds <= 0) return 0;
  // Standard WPM calculation: 5 characters = 1 word
  const wordsTyped = correctChars / 5;
  const minutes = elapsedSeconds / 60;
  return Math.round(wordsTyped / minutes);
};
