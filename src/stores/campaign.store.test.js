import { createStore } from 'vuex'
import getCampaignModule from './campaign.store'
import Dice from '../Dice'

describe('store.campaign', () => {
  describe('initialization', () => {
    it('should parse campaign.js', () => {
      const store = createStore({
        modules: {
          campaign: getCampaignModule(),
        },
      })
      expect(store.state.campaign).toEqual({
        title: 'Example Campaign',
        author: 'Janne Jaanila',
        authorUrl: 'https://github.com/jjaanila',
        publishDate: '2022-02-13',
        language: 'en',
        entry: './src/example/index.js',
        monsters: [
          {
            name: 'Commoner',
            size: 'medium',
            type: 'humanoid (any race)',
            alignment: 'any alignment',
            armorClass: 10,
            armor: '',
            hitPoints: new Dice(0, 0, 4),
            speedFt: 30,
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
            senses: [],
            languages: ['common'],
            challengeRating: 0,
            actions: [
              {
                name: 'Club',
                type: 'melee',
                toHit: 2,
                reachFt: 5,
                damageType: 'bludgeoning',
                damage: new Dice(1, 4, 0),
              },
            ],
            xp: 10,
            id: 'monster-commoner',
          },
          {
            name: 'Swashbuckler of Long Name Islands',
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
            senses: [],
            languages: ['common'],
            challengeRating: 0.5,
            passives: [
              {
                name: 'Pack Tactics',
                description:
                  "The thug has advantage on an attack roll against a creature if at least one of the thug's allies is within 5 ft. of the creature and the ally isn't incapacitated.",
              },
              {
                name: 'Swarm',
                description:
                  "The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points.",
              },
            ],
            actions: [
              { name: 'Multiattack', description: 'The thug makes two melee attacks.' },
              {
                name: 'Mace',
                type: 'melee',
                toHit: 4,
                reachFt: 5,
                damageType: 'bludgeoning',
                damage: new Dice(1, 6, 2),
              },
            ],
            xp: 100,
            id: 'monster-swashbuckler-of-long-name-islands',
          },
        ],
        conditions: [
          {
            name: 'blinded',
            description:
              "A blinded creature can't see and automatically fails any ability check that requires sight. Attack rolls against the creature have advantage, and the creature's Attack rolls have disadvantage.",
          },
          {
            name: 'charmed',
            description:
              "A charmed creature can't Attack the charmer or target the charmer with harmful Abilities or magical Effects. The charmer has advantage on any ability check to interact socially with the creature.",
          },
          {
            name: 'deafened',
            description:
              "A deafened creature can't hear and automatically fails any ability check that requires hearing.",
          },
          {
            name: 'frightened',
            description:
              "A frightened creature has disadvantage on Ability Checks and Attack rolls while the source of its fear is within Line of Sight. The creature can't willingly move closer to the source of its fear.",
          },
          {
            name: 'grappled',
            description:
              "A grappled creature's speed becomes 0, and it can't benefit from any bonus to its speed. The condition ends if the Grappler is incapacitated (see the condition). The condition also ends if an Effect removes the grappled creature from the reach of the Grappler or Grappling Effect, such as when a creature is hurled away by the Thunderwave spell.",
          },
          {
            name: 'incapacitated',
            description: "An incapacitated creature can't take Actions or reactions.",
          },
          {
            name: 'invisible',
            description:
              "An invisible creature is impossible to see without the aid of magic or a Special sense. For the purpose of hiding, the creature is heavily obscured. The creature's location can be detected by any noise it makes or any tracks it leaves. Attack rolls against the creature have disadvantage, and the creature's Attack rolls have advantage.",
          },
          {
            name: 'paralyzed',
            description:
              "A paralyzed creature is incapacitated (see the condition) and can't move or speak. The creature automatically fails Strength and Dexterity Saving Throws. Attack rolls against the creature have advantage. Any Attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.",
          },
          {
            name: 'petrified',
            description:
              "A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone). Its weight increases by a factor of ten, and it ceases aging. The creature is incapacitated (see the condition), can't move or speak, and is unaware of its surroundings. Attack rolls against the creature have advantage. The creature automatically fails Strength and Dexterity Saving Throws. The creature has Resistance to all damage. The creature is immune to poison and disease, although a poison or disease already in its system is suspended, not neutralized.",
          },
          {
            name: 'poisoned',
            description: 'A poisoned creature has disadvantage on Attack rolls and Ability Checks.',
          },
          {
            name: 'prone',
            description:
              "A prone creature's only Movement option is to crawl, unless it stands up and thereby ends the condition. The creature has disadvantage on Attack rolls. An Attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the Attack roll has disadvantage.",
          },
          {
            name: 'restrained',
            description:
              "A restrained creature's speed becomes 0, and it can't benefit from any bonus to its speed. Attack rolls against the creature have advantage, and the creature's Attack rolls have disadvantage. The creature has disadvantage on Dexterity Saving Throws.",
          },
          {
            name: 'stunned',
            description:
              "A stunned creature is incapacitated (see the condition), can't move, and can speak only falteringly. The creature automatically fails Strength and Dexterity Saving Throws. Attack rolls against the creature have advantage.",
          },
          {
            name: 'unconscious',
            description:
              "An unconscious creature is incapacitated (see the condition), can't move or speak, and is unaware of its surroundings. The creature drops whatever it's holding and falls prone. The creature automatically fails Strength and Dexterity Saving Throws. Attack rolls against the creature have advantage. Any Attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.",
          },
          {
            name: 'exhaustion',
            description:
              '1. Disadvantage on Ability Checks 2. Speed halved 3. Disadvantage on Attack rolls and Saving Throws 4. Hit point maximum halved 5. Speed reduced to 0 6. Death',
          },
        ],
      })
    })
  })
})
