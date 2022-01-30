import Dice from './Dice'

export const parseCampaign = campaignJson => {
  return {
    ...campaignJson,
    monsters: campaignJson.monsters.map(monster => ({
      ...monster,
      hitPoints: Dice.deserialize(monster.hitPoints),
      actions: monster.actions?.map(action => ({
        ...action,
        damage: action.damage && Dice.deserialize(action.damage),
      })),
    })),
  }
}
