module.exports = Object.freeze({
  monsters: [
    {
      name: 'Thug',
      size: 'medium',
      type: 'humanoid',
      alignment: 'any alignment',
      armorClass: 11,
      armor: 'Leather Armor',
      hitPoints: { throws: 2, sides: 8, constant: 10 },
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
          damage: { throws: 1, sides: 6, constant: 2 },
        },
      ],
    },
    {
      name: 'Saltwater Scrag',
      size: 'large',
      type: 'giant',
      alignment: 'chaotic evil',
      armorClass: 14,
      armor: '',
      hitPoints: { throws: 8, sides: 10, constant: 40 },
      speedFt: 30,
      strength: 18,
      dexterity: 13,
      constitution: 20,
      intelligence: 7,
      wisdom: 9,
      charisma: 7,
      skills: ['Perception +2'],
      senses: ['darkvision 60ft.', 'passive Perception 12'],
      languages: ['aquan', 'giant'],
      challengeRating: 5,
      passives: [
        {
          name: 'Keen Smell',
          description: 'The Saltwater Scrag has advantage on Wisdom (Perception) checks that rely on smell.',
        },
        {
          name: 'Amphibious',
          description: 'The Saltwater Scrag can breath air and water.',
        },
        {
          name: 'Underwater Regeneration',
          description:
            'While at least partially submerged in salt water, regains 10 hit points at the start of its turn. If takes fire or acid damage, this trait does not function at the start of its next turn. Dies only if starts its turn with 0 hit points and does not regenerate.',
        },
      ],
      actions: [
        {
          name: 'Multiattack',
          description: 'The Saltwater Scrag makes two melee attacks: one with is claws and one with its bite.',
        },
        {
          name: 'Bite',
          type: 'melee',
          toHit: 8,
          reachFt: 5,
          damageType: 'piercing',
          damage: { throws: 1, sides: 10, constant: 5 },
          extra:
            'The target is grappled (escape DC 16). Until this grapple ends, the target is restrained, and The Saltwater Scrag cannot bite another target.',
        },
      ],
    },
  ],
})

/*
{
      name: '',
      size: '',
      type: '',
      alignment: '',
      armorClass: 1,
      armor: '',
      hitPoints: { throws: 1, sides: 1, constant: 1 },
      speedFt: 1,
      strength: 1,
      dexterity: 1,
      constitution: 1,
      intelligence: 1,
      wisdom: 1,
      charisma: 1,
      senses: [],
      languages: [],
      challengeRating: 1,
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
          damage: { throws: 1, sides: 6, constant: 2 },
        },
      ],
    },
*/
