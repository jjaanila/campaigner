import Vue from 'vue'
import Vuex from 'vuex'
import getPartyModule from './party.store'

Vue.use(Vuex)

describe('store.party', () => {
  let characters
  let commitMock

  beforeEach(() => {
    global.localStorage = {
      getItem: jest.fn().mockImplementation(() =>
        JSON.stringify({
          characters,
        })
      ),
    }
    global.confirm = jest.fn().mockImplementation(() => true)
    commitMock = jest.fn()
    characters = [
      {
        id: 'character1',
        name: 'Character 1',
        level: 1,
        hitPoints: 1,
        maxHitPoints: 1,
        armorClass: 1,
        passiveWisdom: 1,
        speed: 10,
        conditions: [],
        inventory: '',
      },
      {
        id: 'character2',
        name: 'Character 2',
        level: 2,
        hitPoints: 2,
        maxHitPoints: 2,
        armorClass: 2,
        passiveWisdom: 2,
        speed: 20,
        conditions: [{ name: 'poisoned' }],
        inventory: 'boots',
      },
      {
        id: 'character3',
        name: 'Character 3',
        level: 3,
        hitPoints: 3,
        maxHitPoints: 3,
        armorClass: 3,
        passiveWisdom: 3,
        speed: 30,
        conditions: [],
        inventory: '',
      },
    ]
  })
  describe('initialization', () => {
    afterEach(() => {
      global.localStorage = undefined
    })

    it('should initialize without existing state', () => {
      global.localStorage = {
        getItem: jest.fn().mockImplementation(() => null),
      }
      const store = new Vuex.Store({
        modules: {
          party: getPartyModule(),
        },
      })
      expect(store.state.party).toEqual({
        characters: [],
        notebook: {},
        encounterLimits: {
          easy: 0,
          medium: 0,
          hard: 0,
          deadly: 0,
        },
      })
    })

    it('should initialize using localStorage', () => {
      const store = new Vuex.Store({
        modules: {
          party: getPartyModule(),
        },
      })
      expect(store.state.party).toEqual({
        characters,
        notebook: {},
        encounterLimits: {
          easy: 150,
          medium: 300,
          hard: 450,
          deadly: 700,
        },
      })
    })

    it('should migrate state to new version', () => {
      global.localStorage = {
        getItem: jest.fn().mockImplementation(() =>
          JSON.stringify({
            characters: [
              {
                name: 'Character 1',
                level: 1,
                hitPoints: 1,
                maxHitPoints: 1,
                armorClass: 1,
                passiveWisdom: 1,
                speed: 30,
              },
            ],
          })
        ),
      }
      const store = new Vuex.Store({
        modules: {
          party: getPartyModule(),
        },
      })
      expect(store.state.party).toEqual({
        characters: [
          {
            id: expect.any(String),
            name: 'Character 1',
            level: 1,
            hitPoints: 1,
            maxHitPoints: 1,
            armorClass: 1,
            passiveWisdom: 1,
            speed: 30,
            conditions: [],
            inventory: '',
          },
        ],
        encounterLimits: {
          easy: 25,
          medium: 50,
          hard: 75,
          deadly: 100,
        },
        notebook: {},
      })
    })
  })

  describe('actions', () => {
    describe('addCharacter', () => {
      it('should add a character', () => {
        getPartyModule().actions.addCharacter(
          { commit: commitMock, state: { characters: [characters[0]], encounterLimits: {} } },
          characters[1]
        )
        expect(commitMock).toHaveBeenCalledWith('setCharacters', [
          characters[0],
          {
            name: '',
            id: expect.any(String),
            level: 1,
            hitPoints: 1,
            maxHitPoints: 1,
            armorClass: 1,
            passiveWisdom: 1,
            speed: 30,
            conditions: [],
            inventory: '',
          },
        ])
        expect(commitMock).toHaveBeenCalledWith('updateEncounterLimits')
      })
    })

    describe('removeCharacter', () => {
      it('should remove a character', () => {
        getPartyModule().actions.removeCharacter(
          { commit: commitMock, state: { characters: [...characters], encounterLimits: {} } },
          characters[1].id
        )
        expect(commitMock).toHaveBeenCalledWith('setCharacters', [characters[0], characters[2]])
        expect(commitMock).toHaveBeenCalledWith('updateEncounterLimits')
      })

      it('should throw if character not found', () => {
        expect(() =>
          getPartyModule().actions.removeCharacter(
            { commit: commitMock, state: { characters: [...characters], encounterLimits: {} } },
            'this does not exist'
          )
        ).toThrow(new Error('Character with id this does not exist not found'))
        expect(commitMock).toHaveBeenCalledTimes(0)
      })
    })

    describe('addCondition', () => {
      it('should add a condition to character', () => {
        getPartyModule().actions.addCondition(
          {
            commit: commitMock,
            state: { characters: [...characters], encounterLimits: {} },
            rootState: { campaign: { conditions: [{ name: 'a' }, { name: 'blind' }, { name: 'c' }] } },
          },
          { characterId: characters[1].id, conditionName: 'blind' }
        )
        expect(commitMock).toHaveBeenCalledWith('setCharacters', [
          characters[0],
          { ...characters[1], conditions: [{ name: 'poisoned' }, { name: 'blind' }] },
          characters[2],
        ])
      })

      it('should not add existing conditions', () => {
        getPartyModule().actions.addCondition(
          {
            commit: commitMock,
            state: { characters: [...characters], encounterLimits: {} },
            rootState: { campaign: { conditions: [{ name: 'a' }, { name: 'poisoned' }, { name: 'c' }] } },
          },
          { characterId: characters[1].id, conditionName: 'poisoned' }
        )
        expect(commitMock).toHaveBeenCalledTimes(0)
      })

      it('should throw if character not found', () => {
        expect(() =>
          getPartyModule().actions.addCondition(
            {
              commit: commitMock,
              state: { characters: [...characters], encounterLimits: {} },
              rootState: { campaign: { conditions: [{ name: 'a' }, { name: 'poisoned' }, { name: 'c' }] } },
            },
            { characterId: 'this does not exist', conditionName: 'poisoned' }
          )
        ).toThrow(new Error('Character with id this does not exist not found'))
      })

      it('should throw if condition not found', () => {
        expect(() =>
          getPartyModule().actions.addCondition(
            {
              commit: commitMock,
              state: { characters: [...characters], encounterLimits: {} },
              rootState: { campaign: { conditions: [{ name: 'a' }, { name: 'c' }] } },
            },
            { characterId: characters[1].id, conditionName: 'b' }
          )
        ).toThrow(new Error('Condition b not found'))
      })
    })

    describe('removeCondition', () => {
      it('should remove a condition from character', () => {
        getPartyModule().actions.removeCondition(
          {
            commit: commitMock,
            state: { characters: [...characters], encounterLimits: {} },
            rootState: { campaign: { conditions: [{ name: 'a' }, { name: 'blind' }, { name: 'c' }] } },
          },
          { characterId: characters[1].id, conditionName: 'poisoned' }
        )
        expect(commitMock).toHaveBeenCalledWith('setCharacters', [
          characters[0],
          { ...characters[1], conditions: [] },
          characters[2],
        ])
      })

      it('should not throw if character does not have condition', () => {
        getPartyModule().actions.removeCondition(
          {
            commit: commitMock,
            state: { characters: [...characters], encounterLimits: {} },
            rootState: { campaign: { conditions: [{ name: 'a' }, { name: 'poisoned' }, { name: 'c' }] } },
          },
          { characterId: characters[1].id, conditionName: 'a' }
        )
        expect(commitMock).toHaveBeenCalledWith('setCharacters', characters)
      })

      it('should throw if character not found', () => {
        expect(() =>
          getPartyModule().actions.removeCondition(
            {
              commit: commitMock,
              state: { characters: [...characters], encounterLimits: {} },
              rootState: { campaign: { conditions: [{ name: 'a' }, { name: 'poisoned' }, { name: 'c' }] } },
            },
            { characterId: 'this does not exist', conditionName: 'poisoned' }
          )
        ).toThrow(new Error('Character with id this does not exist not found'))
      })
    })

    describe('updateCharacterInventory', () => {
      it('should update inventory of one character', () => {
        getPartyModule().actions.updateCharacterInventory(
          { commit: commitMock, state: { characters: [...characters], encounterLimits: {} } },
          { characterId: characters[1].id, inventory: 'a' }
        )
        expect(commitMock).toHaveBeenCalledWith('setCharacters', [
          characters[0],
          { ...characters[1], inventory: 'a' },
          characters[2],
        ])
      })

      it('should throw if character not found', () => {
        expect(() =>
          getPartyModule().actions.updateCharacterInventory(
            {
              commit: commitMock,
              state: { characters: [...characters], encounterLimits: {} },
            },
            { characterId: 'this does not exist', inventory: 'a' }
          )
        ).toThrow(new Error('Character with id this does not exist not found'))
      })
    })
  })
})
