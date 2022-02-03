import Dice from './Dice'
import { generateId } from './utils'
import { findCRData } from './tables'

export const parseCampaign = campaignJson => {
  return {
    ...campaignJson,
    monsters: campaignJson.monsters.map(monster => ({
      ...monster,
      xp: findCRData(monster.challengeRating).xp,
      id: generateId(monster.name, 'monster'),
      hitPoints: Dice.deserialize(monster.hitPoints),
      actions: monster.actions?.map(action => ({
        ...action,
        damage: action.damage && Dice.deserialize(action.damage),
      })),
    })),
    document: {
      parts: campaignJson.document.parts.map(part => ({
        ...part,
        id: generateId(part.name, 'part'),
        chapters: part.chapters.map(chapter => ({
          ...chapter,
          id: generateId(chapter.name, 'chapter'),
          sections: chapter.sections.map(section => ({
            ...section,
            id: generateId(section.name, 'section'),
          })),
        })),
      })),
    },
  }
}
