import { createStore } from 'vuex'
import { distinguishableColors } from '../tables'
import getCombatModule, { GRID_WIDTH, GRID_HEIGHT } from './combat.store'

describe('store.combat', () => {
  let state
  let commitMock
  let enemy1
  let ally1
  let monster1
  let monster2
  let character1

  beforeEach(() => {
    monster1 = {
      id: 'monster1',
      name: 'Monster 1',
      hitPoints: 1,
      passives: [],
    }
    monster2 = {
      id: 'monster2',
      name: 'Monster 2',
      hitPoints: 2,
      passives: [{ name: 'Swarm', description: 'Swarm description' }],
    }
    enemy1 = {
      id: 'enemy1',
      name: 'Monster 1',
      monster: monster1,
      unitType: 'enemy',
    }
    ally1 = {
      id: 'ally1',
      name: 'Monster 2',
      monster: monster2,
      unitType: 'ally',
    }
    character1 = { id: 'character1', name: 'Ismo', unitType: 'character' }
    state = {
      turnOrder: ['ally1', 'character1', 'enemy1'],
      unitIdInTurn: 'character1',
      unitColors: distinguishableColors.map(color => ({ color, isUsed: false })),
      units: [],
    }
    global.localStorage = {
      getItem: jest.fn().mockImplementation(() => JSON.stringify(state)),
    }
    commitMock = jest.fn()
  })
  describe('initialization', () => {
    afterEach(() => {
      global.localStorage = undefined
    })

    it('should initialize using localStorage', () => {
      const store = createStore({
        modules: {
          combat: getCombatModule(),
        },
      })
      expect(store.state.combat).toEqual(state)
    })

    it('should migrate state', () => {
      global.localStorage = {
        getItem: jest.fn().mockImplementation(() =>
          JSON.stringify({
            grid: [],
          })
        ),
      }
      const store = createStore({
        modules: {
          combat: getCombatModule(),
        },
      })
      expect(store.state.combat.grid).toEqual(undefined)
      expect(store.state.combat.units).toEqual([])
      expect(store.state.combat.turnOrder).toEqual([])
    })

    it('should get initial state', () => {
      global.localStorage = {
        getItem: jest.fn().mockImplementation(() => null),
      }
      const store = createStore({
        modules: {
          combat: getCombatModule(),
        },
      })
      expect(store.state.combat).toEqual({
        units: [],
        isInCombat: false,
        turnOrder: [],
        unitIdInTurn: undefined,
        unitColors: [...state.unitColors],
      })
    })
  })

  describe('updateUnits', () => {
    it('should position units', () => {
      character1 = {
        ...character1,
        position: { x: 0, y: 0 },
      }
      ally1 = {
        ...ally1,
        position: { x: 0, y: 1 },
      }
      const state = {
        units: [character1, ally1],
        turnOrder: [],
      }
      getCombatModule().mutations.updateUnits(state, [enemy1, { ...character1, name: 'Jarmo' }, ally1])
      expect(state.units).toEqual([
        { ...enemy1, position: { x: expect.any(Number), y: expect.any(Number) } },
        { ...character1, name: 'Jarmo' },
        ally1,
      ])
    })
  })

  describe('actions', () => {
    let character1
    let campaign

    beforeEach(() => {
      character1 = {
        id: 'character1',
        name: 'Character 1',
        hitPoints: 3,
      }
      campaign = {
        monsters: [monster1, monster2],
      }
    })

    describe('initializeCombat', () => {
      it('should call correct mutations', () => {
        getCombatModule().actions.initializeCombat(
          {
            commit: commitMock,
            state: { units: [enemy1, character1, ally1] },
            rootState: {
              campaign,
            },
            rootGetters: {
              'party/enabledCharacters': [character1],
            },
          },
          { enemies: [enemy1], allies: [ally1] }
        )
        const expectedUnits = [
          {
            ...character1,
            unitType: 'character',
            selected: false,
            hovered: false,
            color: undefined,
            maxHitPoints: 3,
            conditions: [],
          },
          {
            ...enemy1,
            id: expect.any(String),
            unitType: 'enemy',
            selected: false,
            hovered: false,
            color: distinguishableColors[0],
            hitPoints: 1,
            maxHitPoints: 1,
            conditions: [],
          },
          {
            ...ally1,
            id: expect.any(String),
            unitType: 'ally',
            selected: false,
            hovered: false,
            color: distinguishableColors[1],
            hitPoints: 2,
            maxHitPoints: 2,
            conditions: [],
          },
        ]
        const updatedUnitColors = [...state.unitColors]
        updatedUnitColors[0].isUsed = true
        updatedUnitColors[1].isUsed = true
        expect(commitMock.mock.calls).toEqual([
          ['clear'],
          [
            'updateUnits',
            [
              {
                ...expectedUnits[0],
                monster: undefined,
              },
              {
                ...expectedUnits[1],
                monster: monster1,
              },
              {
                ...expectedUnits[2],
                monster: monster2,
              },
            ],
          ],
          ['setTurnOrder', []],
          ['setUnitIdInTurn', undefined],
          ['updateUnitColors', updatedUnitColors],
        ])
      })
    })
    describe('moveUnit', () => {
      it.each([[{ x: 0, y: 0 }], [{ x: 0, y: 2 }], [{ x: 3, y: 3 }]])(
        'should move unit from {x: 0, y: 0} to %s',
        newPosition => {
          enemy1.position = {
            x: 0,
            y: 0,
          }
          character1.position = {
            x: 1,
            y: 0,
          }
          ally1.position = {
            x: 2,
            y: 0,
          }
          getCombatModule().actions.moveUnit(
            {
              commit: commitMock,
              state: { units: [enemy1, character1, ally1] },
              rootState: {
                campaign,
              },
              rootGetters: {
                'party/enabledCharacters': [character1],
              },
            },
            { unit: enemy1, oldPosition: { x: 0, y: 0 }, newPosition }
          )
          expect(commitMock).toHaveBeenCalledWith('moveUnit', {
            unit: enemy1,
            newPosition,
          })
        }
      )

      it.each([[{ x: GRID_WIDTH, y: GRID_HEIGHT }], [{ x: -1, y: -1 }]])(
        'should throw when trying to move unit from {x: 0, y: 0} to %s',
        newPosition => {
          enemy1.position = {
            x: 0,
            y: 0,
          }
          character1.position = {
            x: 1,
            y: 0,
          }
          ally1.position = {
            x: 2,
            y: 0,
          }
          expect(() =>
            getCombatModule().actions.moveUnit(
              {
                commit: commitMock,
                state: { units: [enemy1, character1, ally1] },
                rootState: {
                  campaign,
                },
                rootGetters: {
                  'party/enabledCharacters': [character1],
                },
              },
              { unit: enemy1, oldPosition: { x: 0, y: 0 }, newPosition }
            )
          ).toThrow(new Error(`Invalid position ${newPosition.x}, ${newPosition.y}`))
        }
      )

      it('should do nothing if trying to move into occupied cell ', () => {
        enemy1.position = {
          x: 0,
          y: 0,
        }
        character1.position = {
          x: 1,
          y: 0,
        }
        getCombatModule().actions.moveUnit(
          {
            commit: commitMock,
            state: { units: [enemy1, character1] },
            rootState: {
              campaign,
            },
            rootGetters: {
              'party/enabledCharacters': [character1],
            },
          },
          { unit: enemy1, oldPosition: { x: 0, y: 0 }, newPosition: { x: 1, y: 0 } }
        )
        expect(commitMock).not.toHaveBeenCalled()
      })
    })
  })
})
