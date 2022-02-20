import Dice from '../Dice'
import { getUniqueId } from '../utils'

export const LOCAL_STORAGE_STATE_KEY = 'campaigner-combat'

const GRID_WIDTH = 30
const GRID_HEIGHT = 30
const GRID_LAST_X = GRID_WIDTH - 1
const GRID_LAST_Y = GRID_HEIGHT - 1

const getEmptyGrid = () =>
  Array(GRID_HEIGHT)
    .fill(null)
    .map(_y =>
      Array(GRID_WIDTH)
        .fill(null)
        .map(_x => ({ units: [] }))
    )

const migrateState = state => {
  state.grid ??= getEmptyGrid()
  state.turnOrder ??= []
  return state
}

const getInitialState = () => {
  const state = JSON.parse(localStorage.getItem(LOCAL_STORAGE_STATE_KEY))
  return state
    ? migrateState(state)
    : {
        units: [],
        isInCombat: false,
        grid: getEmptyGrid(),
        turnOrder: [],
        unitIdInTurn: undefined,
      }
}

const getClosestUnoccupiedCell = (grid, x, y) => {
  let closestX = x
  let closestY = y
  let closestDistance = Infinity
  for (let i = 0; i < GRID_WIDTH; i++) {
    for (let j = 0; j < GRID_HEIGHT; j++) {
      if (grid[j][i].units.length === 0) {
        const distance = Math.abs(x - i) + Math.abs(y - j)
        if (distance < closestDistance) {
          closestX = i
          closestY = j
          closestDistance = distance
        }
      }
    }
  }
  return { closestX, closestY }
}

const getRandomInteger = (min, max) => {
  return Math.round(Math.random() * (max - min) + min)
}

const addEnemiesToGrid = (grid, enemies) => {
  enemies.forEach(enemy => {
    let x = getRandomInteger(0, GRID_LAST_X)
    let y = getRandomInteger(0, Math.ceil(GRID_LAST_Y / 2))

    if (grid[y][x].units.length) {
      const { closestX, closestY } = getClosestUnoccupiedCell(grid, x, y)
      x = closestX
      y = closestY
    }
    grid[y][x].units.push(enemy)
  })
  return grid
}

const addPartyToGrid = (grid, characters) => {
  characters.forEach(character => {
    let x = getRandomInteger(0, GRID_LAST_X)
    let y = GRID_LAST_Y - 5

    if (grid[y][x].units.length) {
      const { closestX, closestY } = getClosestUnoccupiedCell(grid, x, y)
      x = closestX
      y = closestY
    }
    grid[y][x].units.push(character)
  })
  return grid
}

const addAlliesToGrid = (grid, allies) => {
  allies.forEach(ally => {
    let x = getRandomInteger(0, GRID_LAST_X)
    let y = GRID_LAST_Y - 5

    if (grid[y][x].units.length) {
      const { closestX, closestY } = getClosestUnoccupiedCell(grid, x, y)
      x = closestX
      y = closestY
    }
    grid[y][x].units.push(ally)
  })
  return grid
}

const createUnit = (creature, unitType) => {
  const maxHp = creature.hitPoints instanceof Dice ? creature.hitPoints.throw() : creature.hitPoints
  return {
    ...creature,
    id: ['enemy', 'ally'].includes(unitType) ? getUniqueId() : creature.id,
    selected: false,
    maxHitPoints: maxHp,
    hitPoints: maxHp,
    unitType,
  }
}

export default () => ({
  namespaced: true,
  state: getInitialState(),
  getters: {
    getUnitById: state => id => state.units.find(unit => unit.id === id),
    enemies: state => state.units.filter(unit => unit.unitType === 'enemy'),
    allies: state => state.units.filter(unit => unit.unitType === 'ally'),
    characters: state => state.units.filter(unit => unit.unitType === 'character'),
  },
  mutations: {
    setIsInCombat(state, value) {
      state.isInCombat = value
    },
    setGrid(state, grid) {
      state.grid = grid
    },
    setTurnOrder(state, turnOrder) {
      state.turnOrder = turnOrder
    },
    setUnitIdInTurn(state, unitId) {
      state.unitIdInTurn = unitId
    },
    setUnits(state, units) {
      state.units = units
    },
    moveUnit(state, { unit, oldPosition, newPosition }) {
      state.grid[oldPosition.y][oldPosition.x].units = state.grid[oldPosition.y][oldPosition.x].units.filter(
        oldPosUnit => oldPosUnit.id !== unit.id
      )
      state.grid[newPosition.y][newPosition.x].units.push(unit)
    },
    updateUnit(state, unit) {
      const oldUnit = state.units.find(u => u.id === unit.id)
      if (!oldUnit) {
        throw new Error(`Unit with id ${unit.id} not found`)
      }
      unit.hitPoints = Math.max(Math.min(unit.hitPoints, oldUnit.maxHitPoints), 0)
      Object.assign(oldUnit, unit)
    },
  },
  actions: {
    initializeCombat({ commit, rootState }, { enemies, allies }) {
      const enemyUnits = enemies.reduce((monsters, enemy) => {
        const monster = rootState.campaign.monsters.find(monster => monster.name === enemy.name)
        if (!monster) {
          throw new Error(`Monster ${enemy.name} not found`)
        }
        return monsters.concat(
          Array(enemy.quantity)
            .fill(null)
            .map(_i => createUnit(monster, 'enemy'))
        )
      }, [])
      const allyUnits = allies.reduce((monsters, ally) => {
        const monster = rootState.campaign.monsters.find(monster => monster.name === ally.name)
        if (!monster) {
          throw new Error(`Monster ${ally.name} not found`)
        }
        return monsters.concat(
          Array(ally.quantity)
            .fill(null)
            .map(_i => createUnit(monster, 'ally'))
        )
      }, [])
      const grid = getEmptyGrid()
      addEnemiesToGrid(grid, enemyUnits)
      const characterUnits = rootState.party.characters.map(character => createUnit(character, 'character'))
      const units = [...characterUnits, ...enemyUnits, ...allyUnits]
      addPartyToGrid(grid, characterUnits)
      addAlliesToGrid(grid, allyUnits)
      commit('setGrid', grid)
      commit('setUnits', units)
      commit(
        'setTurnOrder',
        units.map(unit => unit.id)
      )
      commit('setUnitIdInTurn', units[0].id)
    },
    setIsInCombat({ commit }, value) {
      commit('setIsInCombat', value)
    },
    moveUnit({ commit, state }, { unit, oldPosition, newPosition }) {
      if (
        newPosition.x < 0 ||
        newPosition.x >= state.grid[0].length ||
        newPosition.y < 0 ||
        newPosition.y >= state.grid.length
      ) {
        throw new Error(`Invalid position ${newPosition.x}, ${newPosition.y}`)
      }
      if (!state.grid[oldPosition.y][oldPosition.x].units.some(oldPosUnit => oldPosUnit.id === unit.id)) {
        throw new Error(
          `Tried moving unit ${unit.id} from ${oldPosition.x}, ${oldPosition.y} to ${newPosition.x}, ${newPosition.y} but unit was not found`
        )
      }
      if (state.grid[newPosition.y][newPosition.x].units.filter(u => u.id !== unit.id).length) {
        const hasAtLeastTwoNonSwarmUnits =
          [...state.grid[newPosition.y][newPosition.x].units, unit].filter(
            unit => !(unit.passives?.some(passive => passive.name === 'Swarm') ?? false)
          ).length > 1
        if (hasAtLeastTwoNonSwarmUnits) {
          console.info(
            `Tried moving unit ${unit.id} from ${oldPosition.x}, ${oldPosition.y} to ${newPosition.x}, ${newPosition.y} but new position is occupied`
          )
          return
        }
      }
      commit('moveUnit', { unit, oldPosition, newPosition })
    },
    setTurnOrder({ commit }, turnOrder) {
      commit('setTurnOrder', turnOrder)
    },
    setUnitIdInTurn({ commit }, unitId) {
      commit('setUnitIdInTurn', unitId)
    },
    updateUnit({ commit }, unit) {
      commit('updateUnit', unit)
    },
  },
})
