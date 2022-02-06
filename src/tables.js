const crTable = Object.freeze([
  { challengeRating: 0, xp: 10, proficiency: 2 },
  { challengeRating: 1 / 8, xp: 25, proficiency: 2 },
  { challengeRating: 1 / 4, xp: 50, proficiency: 2 },
  { challengeRating: 1 / 2, xp: 100, proficiency: 2 },
  { challengeRating: 1, xp: 200, proficiency: 2 },
  { challengeRating: 2, xp: 450, proficiency: 2 },
  { challengeRating: 3, xp: 700, proficiency: 2 },
  { challengeRating: 4, xp: 1100, proficiency: 2 },
  { challengeRating: 5, xp: 1800, proficiency: 3 },
  { challengeRating: 6, xp: 2300, proficiency: 3 },
  { challengeRating: 7, xp: 2900, proficiency: 3 },
  { challengeRating: 8, xp: 3900, proficiency: 3 },
  { challengeRating: 9, xp: 5000, proficiency: 4 },
  { challengeRating: 10, xp: 5900, proficiency: 4 },
  { challengeRating: 11, xp: 7200, proficiency: 4 },
  { challengeRating: 12, xp: 8400, proficiency: 4 },
  { challengeRating: 13, xp: 10000, proficiency: 5 },
  { challengeRating: 14, xp: 11500, proficiency: 5 },
  { challengeRating: 15, xp: 13000, proficiency: 5 },
  { challengeRating: 16, xp: 15000, proficiency: 5 },
  { challengeRating: 17, xp: 18000, proficiency: 6 },
  { challengeRating: 18, xp: 20000, proficiency: 6 },
  { challengeRating: 19, xp: 22000, proficiency: 6 },
  { challengeRating: 20, xp: 25000, proficiency: 6 },
  { challengeRating: 21, xp: 33000, proficiency: 7 },
  { challengeRating: 22, xp: 41000, proficiency: 7 },
  { challengeRating: 23, xp: 50000, proficiency: 7 },
  { challengeRating: 24, xp: 62000, proficiency: 7 },
  { challengeRating: 25, xp: 75000, proficiency: 8 },
  { challengeRating: 26, xp: 90000, proficiency: 8 },
  { challengeRating: 27, xp: 105000, proficiency: 8 },
  { challengeRating: 28, xp: 120000, proficiency: 8 },
  { challengeRating: 29, xp: 135000, proficiency: 9 },
  { challengeRating: 30, xp: 155000, proficiency: 9 },
])

export const findCRData = challengeRating => {
  const crRecord = crTable.find(record => record.challengeRating === challengeRating)
  if (!crRecord) {
    throw new Error(`Did not find data for challengeRating ${challengeRating}`)
  }
  return crRecord
}

export const encounterDifficulties = Object.freeze([
  { characterLevel: 1, easy: 25, medium: 50, hard: 75, deadly: 100 },
  { characterLevel: 2, easy: 50, medium: 100, hard: 150, deadly: 200 },
  { characterLevel: 3, easy: 75, medium: 150, hard: 225, deadly: 400 },
  { characterLevel: 4, easy: 125, medium: 250, hard: 375, deadly: 500 },
  { characterLevel: 5, easy: 250, medium: 500, hard: 750, deadly: 1100 },
  { characterLevel: 6, easy: 300, medium: 600, hard: 900, deadly: 1400 },
  { characterLevel: 7, easy: 350, medium: 750, hard: 1100, deadly: 1700 },
  { characterLevel: 8, easy: 450, medium: 900, hard: 1400, deadly: 2100 },
  { characterLevel: 9, easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
  { characterLevel: 10, easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
  { characterLevel: 11, easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
  { characterLevel: 12, easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
  { characterLevel: 13, easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
  { characterLevel: 14, easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
  { characterLevel: 15, easy: 1400, medium: 2800, hard: 4100, deadly: 6400 },
  { characterLevel: 16, easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
  { characterLevel: 17, easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
  { characterLevel: 18, easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
  { characterLevel: 19, easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
  { characterLevel: 20, easy: 2800, medium: 5700, hard: 8500, deadly: 12700 },
])
