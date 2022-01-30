import Dice from './src/Dice'
export default {
  monsters: [
    {
      name: 'Thug 3',
      size: 'medium',
      type: 'humanoid',
      alignment: 'any alignment',
      armorClass: 11,
      armor: 'Leather Armor',
      hitPoints: new Dice(2, 8, 10),
      speedFt: 30,
      strength: 15,
      dexterity: 11,
      constitution: 14,
      intelligence: 10,
      wisdom: 10,
      charisma: 11,
      senses: ['passive Perception 10'],
      languages: ['common'],
      challengeRating: 0.5,
      passives: [
        {
          name: 'Pack Tactics',
          description:
            'The thug has advantage on an attack roll against a creature if at least one of the thug’s allies is within 5 ft. of the creature and the ally isn’t incapacitated.',
        },
      ],
      actions: [
        {
          name: 'Multiattack',
          description: 'The thug makes two melee attacks.',
        },
        {
          name: 'Mace',
          type: 'melee',
          toHit: 4,
          reachFt: 5,
          damageType: 'bludgeoning',
          damage: new Dice(1, 6, 2),
        },
      ],
    },
    {
      name: 'Thug 2',
      size: 'medium',
      type: 'humanoid',
      alignment: 'any alignment',
      armorClass: 11,
      armor: 'Leather Armor',
      hitPoints: new Dice(2, 8, 10),
      speedFt: 30,
      strength: 15,
      dexterity: 11,
      constitution: 14,
      intelligence: 10,
      wisdom: 10,
      charisma: 11,
      senses: ['passive Perception 10'],
      languages: ['common'],
      challengeRating: 0.5,
      passives: [
        {
          name: 'Pack Tactics',
          description:
            'The thug has advantage on an attack roll against a creature if at least one of the thug’s allies is within 5 ft. of the creature and the ally isn’t incapacitated.',
        },
      ],
      actions: [
        {
          name: 'Multiattack',
          description: 'The thug makes two melee attacks.',
        },
        {
          name: 'Mace',
          toHit: 4,
          reachFt: 5,
          rangeFt: 10,
          disadvantageRangeFt: 50,
          damageType: 'bludgeoning',
          damage: new Dice(1, 6, 2),
        },
      ],
    },
  ],
}
