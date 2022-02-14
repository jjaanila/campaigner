import { getUniqueId } from '../utils'

export const LOCAL_STORAGE_STATE_KEY = 'campaigner-combat'

const GRID_WIDTH = 30
const GRID_HEIGHT = 30
const GRID_LAST_X = GRID_WIDTH - 1
const GRID_LAST_Y = GRID_HEIGHT - 1

const getEmptyGrid = () =>
  Array(GRID_HEIGHT)
    .fill(null)
    .map(y =>
      Array(GRID_WIDTH)
        .fill(null)
        .map(x => ({ units: [] }))
    )

const migrateState = state => {
  state.grid ??= getEmptyGrid()
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
    setIsInCombat(state, value) {
      state.isInCombat = value
    },
    setGrid(state, grid) {
      state.grid = grid
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
        return monsters.concat(Array(enemy.quantity).fill({ ...monster, id: getUniqueId() }))
      }, [])
      commit('setEnemies', enemyUnits)
      const grid = getEmptyGrid()
      addEnemiesToGrid(grid, enemyUnits)
      commit('setGrid', grid)
      commit('setAllies', allies)
    },
    setIsInCombat({ commit }, value) {
      commit('setIsInCombat', value)
    },
  },
}

export default storeConfig
