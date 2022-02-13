import campaignJson from 'project-root/campaign'
import { sortByKey, generateId } from '../utils'
import Dice from '../Dice'
import { findCRData } from '../tables'

export const parseCampaign = campaignJson => {
  return {
    ...campaignJson,
    monsters: sortByKey(
      campaignJson.monsters.map(monster => ({
        ...monster,
        xp: findCRData(monster.challengeRating).xp,
        id: generateId(monster.name, 'monster'),
        hitPoints: Dice.deserialize(monster.hitPoints),
        actions: monster.actions?.map(action => ({
          ...action,
          damage: action.damage && Dice.deserialize(action.damage),
        })),
      })),
      'name'
    ),
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

export default {
  namespaced: true,
  state: parseCampaign(campaignJson),
}
