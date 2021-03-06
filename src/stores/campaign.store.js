import campaignJs from 'project-root/campaign'
import { generateId } from '../utils'
import sortBy from 'lodash/sortBy'
import Dice from '../Dice'
import { findCRData } from '../tables'

const parseCampaign = campaignJs => {
  return {
    ...campaignJs,
    monsters: sortBy(
      campaignJs.monsters.map(monster => ({
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
  }
}

export default () => ({
  namespaced: true,
  state: parseCampaign(campaignJs),
})
