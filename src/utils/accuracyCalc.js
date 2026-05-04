export const calculateAccuracy = (correctChars, totalChars) => {
  if (totalChars === 0) return 100;
  const accuracy = (correctChars / totalChars) * 100;
  return Number(accuracy.toFixed(1));
};
