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
        enemies: [],
        allies: [],
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

const storeConfig = {
  namespaced: true,
  state: getInitialState(),
  mutations: {
    setEnemies(state, enemies) {
      state.enemies = enemies
    },
    setAllies(state, allies) {
      state.allies = allies
    },
    setCharacters(state, characters) {
      state.characters = characters
    },
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
      console.log(unitId)
      state.unitIdInTurn = unitId
    },
    moveUnit(state, { unit, oldPosition, newPosition }) {
      state.grid[oldPosition.y][oldPosition.x].units = state.grid[oldPosition.y][oldPosition.x].units.filter(
        oldPosUnit => oldPosUnit.id !== unit.id
      )
      state.grid[newPosition.y][newPosition.x].units.push(unit)
    },
  },
  actions: {
    addCharacter({ commit, state }) {
      commit('setCharacters', [
        ...state.characters,
        {
          name: '',
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
    },
    initializeCombat({ commit, rootState }, { enemies, allies }) {
      const enemyUnits = enemies.reduce((monsters, enemy) => {
        const monster = rootState.campaign.monsters.find(monster => monster.name === enemy.name)
        if (!monster) {
          throw new Error(`Monster ${enemy.name} not found`)
        }
        return monsters.concat(
          Array(enemy.quantity)
            .fill(null)
            .map(_i => ({ ...monster, id: getUniqueId(), unitType: 'enemy' }))
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
            .map(_i => ({ ...monster, id: getUniqueId(), unitType: 'ally' }))
        )
      }, [])
      const grid = getEmptyGrid()
      addEnemiesToGrid(grid, enemyUnits)
      const characterUnits = rootState.party.characters.map(character => ({
        ...character,
        unitType: 'character',
      }))
      addPartyToGrid(grid, characterUnits)
      addAlliesToGrid(grid, allyUnits)
      commit('setGrid', grid)
      commit('setAllies', allyUnits)
      commit('setEnemies', enemyUnits)
      commit('setCharacters', characterUnits)
      commit(
        'setTurnOrder',
        [...characterUnits, ...enemyUnits, ...allyUnits].map(unit => unit.id)
      )
    },
    setIsInCombat({ commit }, value) {
      commit('setIsInCombat', value)
    },
    moveUnit({ commit, state }, { unit, oldPosition, newPosition }) {
      if (!state.grid[oldPosition.y][oldPosition.x].units.some(oldPosUnit => oldPosUnit.id === unit.id)) {
        console.error(
          `Tried moving unit ${unit.id} from ${oldPosition.x}, ${oldPosition.y} to ${newPosition.x}, ${newPosition.y} but unit was not found`
        )
        return
      }
      if (state.grid[newPosition.y][newPosition.x].units.length) {
        const hasAtLeastTwoNonSwarmUnits =
          [...state.grid[newPosition.y][newPosition.x].units, unit].filter(
            unit => !(unit.passives?.some(passive => passive.name === 'Swarm') ?? false)
          ).length > 1
        if (hasAtLeastTwoNonSwarmUnits) {
          console.error(
            `Tried moving unit ${unit.id} from ${oldPosition.x}, ${oldPosition.y} to ${newPosition.x}, ${newPosition.y} but new position is occupied`
          )
          return
        }
      }
      commit('moveUnit', { unit, oldPosition, newPosition })
    },
    setTurnOrder({ commit, state }) {
      commit('setTurnOrder', state.turnOrder)
    },
    setUnitIdInTurn({ commit }, unitId) {
      commit('setUnitIdInTurn', unitId)
    },
  },
}

export default storeConfig
