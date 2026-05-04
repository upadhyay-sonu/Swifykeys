export const LEVELS = [
  { level: 1, xpRequired: 0,    title: "Beginner" },
  { level: 2, xpRequired: 500,  title: "Typist" },
  { level: 3, xpRequired: 1500, title: "Swift" },
  { level: 4, xpRequired: 3000, title: "Rapid" },
  { level: 5, xpRequired: 5500, title: "Blazing" },
  { level: 6, xpRequired: 9000, title: "Legend" },
];

export const calculateLevel = (totalXp) => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVELS[i].xpRequired) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
};

export const calculateXpEarned = (wpm, accuracy, isPersonalBest, streakDays, noMistakes) => {
  let xp = Math.round(wpm * (accuracy / 100));
  
  if (noMistakes) xp += 50;
  if (isPersonalBest) xp += 30;
  xp += 20 * streakDays; // streak bonus
  
  return xp;
};
