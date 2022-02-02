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
  }
}
