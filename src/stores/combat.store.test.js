import Vue from 'vue'
import Vuex from 'vuex'
import getCombatModule from './combat.store'

Vue.use(Vuex)

describe('store.combat', () => {
  let state
  let commitMock

  beforeEach(() => {
    state = Object.freeze({
      grid: [
        [{ units: [{ id: 'enemy1', name: 'Monster 1', unitType: 'enemy' }] }],
        [{ units: [{ id: 'ally1', name: 'Commoner', unitType: 'ally' }] }],
        [{ units: [{ id: 'character1', name: 'Ismo', unitType: 'character' }] }],
      ],
      turnOrder: ['ally1', 'character1', 'enemy1'],
      currentTurn: 'character1',
    })
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
      const store = new Vuex.Store({
        modules: {
          combat: getCombatModule(),
        },
      })
      expect(store.state.combat).toEqual(state)
    })

    it('should migrate state', () => {
      global.localStorage = {
        getItem: jest.fn().mockImplementation(() => JSON.stringify({})),
      }
      const store = new Vuex.Store({
        modules: {
          combat: getCombatModule(),
        },
      })
      expect(store.state.combat.grid).toEqual(expect.any(Array))
      expect(store.state.combat.grid).toHaveLength(30)
      store.state.combat.grid.forEach(y => {
        expect(y).toEqual(expect.any(Array))
        expect(y).toHaveLength(30)
      })
      expect(store.state.combat.turnOrder).toEqual([])
    })

    it('should get initial state', () => {
      global.localStorage = {
        getItem: jest.fn().mockImplementation(() => null),
      }
      const store = new Vuex.Store({
        modules: {
          combat: getCombatModule(),
        },
      })
      expect(store.state.combat).toEqual({
        units: [],
        isInCombat: false,
        grid: expect.any(Array),
        turnOrder: [],
        unitIdInTurn: undefined,
      })
    })
  })

  describe('actions', () => {
    let character1
    let enemy1
    let ally1
    let monster1
    let monster2
    let campaign

    beforeEach(() => {
      character1 = {
        id: 'character1',
        name: 'Character 1',
        level: 1,
        hitPoints: 3,
      }
      enemy1 = {
        name: 'Monster 1',
      }
      ally1 = {
        name: 'Monster 2',
      }
      monster1 = {
        id: 'monster1',
        name: 'Monster 1',
        hitPoints: 1,
      }
      monster2 = {
        id: 'monster2',
        name: 'Monster 2',
        hitPoints: 2,
        passives: [{ name: 'Swarm', description: 'Swarm description' }],
      }
      campaign = {
        monsters: [monster1, monster2],
      }
    })

    describe('initializeCombat', () => {
      it('should place enemies and allies into grid', () => {
        getCombatModule().actions.initializeCombat(
          {
            commit: commitMock,
            state: {},
            rootState: {
              party: {
                characters: [character1],
              },
              campaign,
            },
          },
          { enemies: [enemy1], allies: [ally1] }
        )
        const expectedUnits = [
          {
            ...character1,
            unitType: 'character',
            selected: false,
            maxHitPoints: 3,
          },
          {
            ...enemy1,
            ...monster1,
            id: expect.any(String),
            unitType: 'enemy',
            selected: false,
            hitPoints: 1,
            maxHitPoints: 1,
          },
          {
            ...ally1,
            ...monster2,
            id: expect.any(String),
            unitType: 'ally',
            selected: false,
            hitPoints: 2,
            maxHitPoints: 2,
          },
        ]
        expect(commitMock).toHaveBeenCalledWith('setGrid', expect.any(Array))
        const grid = commitMock.mock.calls[0][1]
        expect(grid).toHaveLength(30)
        const gridUnits = grid
          .flat()
          .map(y => y.units)
          .flat()
        expect(gridUnits).toHaveLength(expectedUnits.length)
        expect(gridUnits).toEqual(expect.arrayContaining(expectedUnits))
        expect(commitMock).toHaveBeenCalledWith('setUnits', expectedUnits)
        expect(commitMock).toHaveBeenCalledWith('setTurnOrder', [
          character1.id,
          expect.any(String),
          expect.any(String),
        ])
        expect(commitMock).toHaveBeenCalledWith('setUnitIdInTurn', character1.id)
      })

      describe('moveUnit', () => {
        it.each([[{ x: 0, y: 0 }], [{ x: 0, y: 2 }], [{ x: 3, y: 3 }]])(
          'should move unit from {x: 0, y: 0} to %s',
          newPosition => {
            getCombatModule().actions.moveUnit(
              {
                commit: commitMock,
                state: {
                  grid: [
                    [{ units: [enemy1] }, { units: [character1] }, { units: [ally1] }, { units: [] }],
                    [{ units: [] }, { units: [] }, { units: [] }, { units: [] }],
                    [{ units: [] }, { units: [] }, { units: [] }, { units: [] }],
                    [{ units: [] }, { units: [] }, { units: [] }, { units: [] }],
                  ],
                },
                rootState: {
                  party: {
                    characters: [character1],
                  },
                  campaign,
                },
              },
              { unit: enemy1, oldPosition: { x: 0, y: 0 }, newPosition }
            )
            expect(commitMock).toHaveBeenCalledWith('moveUnit', {
              unit: enemy1,
              oldPosition: { x: 0, y: 0 },
              newPosition,
            })
          }
        )

        it.each([[{ x: 4, y: 4 }], [{ x: -1, y: -1 }]])(
          'should throw when trying to move unit from {x: 0, y: 0} to %s',
          newPosition => {
            expect(() =>
              getCombatModule().actions.moveUnit(
                {
                  commit: commitMock,
                  state: {
                    grid: [
                      [{ units: [enemy1] }, { units: [character1] }, { units: [ally1] }, { units: [] }],
                      [{ units: [] }, { units: [] }, { units: [] }, { units: [] }],
                      [{ units: [] }, { units: [] }, { units: [] }, { units: [] }],
                      [{ units: [] }, { units: [] }, { units: [] }, { units: [] }],
                    ],
                  },
                  rootState: {
                    party: {
                      characters: [character1],
                    },
                    campaign,
                  },
                },
                { unit: enemy1, oldPosition: { x: 0, y: 0 }, newPosition }
              )
            ).toThrow(new Error(`Invalid position ${newPosition.x}, ${newPosition.y}`))
          }
        )

        it('should do nothing if trying to move into occupied cell ', () => {
          getCombatModule().actions.moveUnit(
            {
              commit: commitMock,
              state: {
                grid: [
                  [{ units: [enemy1] }, { units: [character1] }, { units: [] }, { units: [] }],
                  [{ units: [] }, { units: [] }, { units: [] }, { units: [] }],
                  [{ units: [] }, { units: [] }, { units: [] }, { units: [] }],
                  [{ units: [] }, { units: [] }, { units: [] }, { units: [] }],
                ],
              },
              rootState: {
                party: {
                  characters: [character1],
                },
                campaign,
              },
            },
            { unit: enemy1, oldPosition: { x: 0, y: 0 }, newPosition: { x: 1, y: 0 } }
          )
          expect(commitMock).not.toHaveBeenCalled()
        })
      })
    })
  })
})
