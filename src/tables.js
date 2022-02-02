const crTable = [
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
]

export const findCRData = challengeRating => {
  const crRecord = crTable.find(record => record.challengeRating === challengeRating)
  if (!crRecord) {
    throw new Error(`Did not find data for challengeRating ${challengeRating}`)
  }
  return crRecord
}
