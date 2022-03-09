import { getUniqueId } from '../utils'
import Dice from '../Dice'
import { distinguishableColors } from '../tables'

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

const defaultUnitColors = distinguishableColors.map(color => ({ color, isUsed: false }))

const migrateState = state => {
  state.grid ??= getEmptyGrid()
  state.turnOrder ??= []
  state.unitColors ??= [...defaultUnitColors]
  return state
}

const getEmptyState = () => ({
  units: [],
  isInCombat: false,
  grid: getEmptyGrid(),
  turnOrder: [],
  unitIdInTurn: undefined,
  unitColors: [...defaultUnitColors],
})

const getInitialState = () => {
  try {
    const state = JSON.parse(localStorage.getItem(LOCAL_STORAGE_STATE_KEY))
    return state ? migrateState(state) : getEmptyState()
  } catch (e) {
    return getEmptyState()
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

const removeUnitFromGrid = (grid, unit) => {
  const unitIndex = grid[unit.position.y][unit.position.x].units.findIndex(u => u.id === unit.id)
  grid[unit.position.y][unit.position.x].units.splice(unitIndex, 1)
  unit.position = undefined
}

const addUnitToGrid = (grid, unit, position) => {
  grid[position.y][position.x].units.push(unit)
  unit.position = position
}

const addEnemyToGrid = (grid, enemy) => {
  let x = getRandomInteger(0, GRID_LAST_X)
  let y = getRandomInteger(0, Math.ceil(GRID_LAST_Y / 2))

  if (grid[y][x].units.length) {
    const { closestX, closestY } = getClosestUnoccupiedCell(grid, x, y)
    x = closestX
    y = closestY
  }
  addUnitToGrid(grid, enemy, { x, y })
}

const addCharacterToGrid = (grid, character) => {
  let x = getRandomInteger(0, GRID_LAST_X)
  let y = GRID_LAST_Y - 5

  if (grid[y][x].units.length) {
    const { closestX, closestY } = getClosestUnoccupiedCell(grid, x, y)
    x = closestX
    y = closestY
  }
  addUnitToGrid(grid, character, { x, y })
}

const addAllyToGrid = (grid, ally) => {
  let x = getRandomInteger(0, GRID_LAST_X)
  let y = GRID_LAST_Y - 5

  if (grid[y][x].units.length) {
    const { closestX, closestY } = getClosestUnoccupiedCell(grid, x, y)
    x = closestX
    y = closestY
  }
  addUnitToGrid(grid, ally, { x, y })
}

const addUnitsToGrid = (grid, units) => {
  for (const unit of units) {
    switch (unit.unitType) {
      case 'character':
        addCharacterToGrid(grid, unit)
        continue
      case 'enemy':
        addEnemyToGrid(grid, unit)
        continue
      case 'ally':
        addAllyToGrid(grid, unit)
        continue
      default:
        console.info(unit)
        throw new Error(`Unknown unit type ${unit.unitType}`)
    }
  }
}

export const isHorde = unit => {
  return Array.isArray(unit.members)
}

const getHordeName = members =>
  `Horde of ${members.filter(member => member.hitPoints > 0).length} ${members[0].monster.name}`

const splitHorde = horde => {
  let remainingHitpoints = horde.hitPoints
  const remainingUnits = []
  horde.members.forEach(memberUnit => {
    if (remainingHitpoints === 0) {
      remainingUnits.push({ ...memberUnit, hitPoints: 0 })
      return
    }
    const unitHitPoints = Math.min(remainingHitpoints, memberUnit.maxHitPoints)
    remainingUnits.push({ ...memberUnit, hitPoints: unitHitPoints })
    remainingHitpoints -= unitHitPoints
  })
  return remainingUnits
}

const createHorde = units => {
  if (
    units.length < 1 ||
    !units.every(unit => unit.monster.name === units[0].monster.name && unit.unitType === units[0].unitType)
  ) {
    throw new Error('Horde must be made of multiple units of same unitType and name')
  }
  const members = units.reduce((memo, unit) => memo.concat(isHorde(unit) ? splitHorde(unit) : [unit]), [])
  const hitPoints = units.reduce((totalHp, unit) => totalHp + unit.hitPoints, 0)
  const maxHitPoints = units.reduce((totalMaxHp, unit) => totalMaxHp + unit.maxHitPoints, 0)
  return {
    name: getHordeName(members),
    monster: units[0].monster,
    id: getUniqueId(),
    selected: true,
    maxHitPoints,
    hitPoints,
    unitType: units[0].unitType,
    conditions: [],
    members,
  }
}

const reserveUnitColor = unitColors => {
  const unitColor = unitColors.find(color => !color.isUsed) // We can run out of colors!
  if (unitColor === undefined) {
    return 'red'
  }
  unitColor.isUsed = true
  return unitColor.color
}

const createUnitFromCreature = (monsterOrCharacter, unitType, unitColors) => {
  const maxHitPoints =
    monsterOrCharacter.hitPoints instanceof Dice
      ? monsterOrCharacter.hitPoints.throw()
      : monsterOrCharacter.hitPoints
  return {
    name: monsterOrCharacter.name,
    monster: ['enemy', 'ally'].includes(unitType) ? monsterOrCharacter : undefined,
    id: ['enemy', 'ally'].includes(unitType) ? getUniqueId() : monsterOrCharacter.id,
    selected: false,
    hovered: false,
    maxHitPoints,
    hitPoints: maxHitPoints,
    unitType,
    conditions: monsterOrCharacter.conditions ?? [],
    color: ['enemy', 'ally'].includes(unitType) ? reserveUnitColor(unitColors) : undefined,
  }
}

const getNextInTurn = (unitIdInTurn, turnOrder) => {
  const inTurnIndex = turnOrder.findIndex(unit => unit.id === unitIdInTurn)
  return turnOrder[(inTurnIndex + 1) % turnOrder.length]
}

export default () => ({
  namespaced: true,
  state: getInitialState(),
  getters: {
    getUnitById: state => id => state.units.find(unit => unit.id === id),
    enemies: state => state.units.filter(unit => unit.unitType === 'enemy'),
    allies: state => state.units.filter(unit => unit.unitType === 'ally'),
    characters: state => state.units.filter(unit => unit.unitType === 'character'),
    selectedUnits: state => state.units.filter(unit => unit.selected),
    canConvertSelectedToHorde(state, getters) {
      return (
        getters.selectedUnits.length > 1 &&
        getters.selectedUnits.every(
          unit =>
            unit.monster?.name === getters.selectedUnits[0].monster?.name &&
            unit.unitType === getters.selectedUnits[0].unitType &&
            unit.unitType !== 'character'
        )
      )
    },
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
    clear(state) {
      Object.assign(state, getEmptyState())
    },
    updateUnits(state, units) {
      const deletedUnits = state.units.filter(unit => !units.find(u => u.id === unit.id))
      const addedUnits = units.filter(unit => !state.units.find(u => u.id === unit.id))
      const turnOrderWithAdded = [...state.turnOrder, ...addedUnits.map(unit => unit.id)]
      const newTurnOrder = turnOrderWithAdded.filter(unitId => !deletedUnits.some(unit => unit.id === unitId))
      let nextInTurn
      if (deletedUnits.some(unit => unit.id === state.unitIdInTurn)) {
        nextInTurn = getNextInTurn(state.unitIdInTurn, turnOrderWithAdded)
        while (deletedUnits.some(unit => unit.id === nextInTurn) && newTurnOrder.length) {
          nextInTurn = getNextInTurn(state.unitIdInTurn, turnOrderWithAdded)
        }
      }
      deletedUnits.forEach(unit => removeUnitFromGrid(state.grid, unit))
      addUnitsToGrid(state.grid, addedUnits)
      state.turnOrder = newTurnOrder
      state.units = units
      if (nextInTurn) {
        state.unitIdInTurn = nextInTurn
      }
    },
    moveUnit(state, { unit, oldPosition, newPosition }) {
      state.grid[oldPosition.y][oldPosition.x].units = state.grid[oldPosition.y][oldPosition.x].units.filter(
        oldPosUnit => oldPosUnit.id !== unit.id
      )
      state.grid[newPosition.y][newPosition.x].units.push(unit)
      unit.position = { x: newPosition.x, y: newPosition.y }
    },
    updateUnit(state, unit) {
      const oldUnit = state.units.find(u => u.id === unit.id)
      if (!oldUnit) {
        throw new Error(`Unit with id ${unit.id} not found`)
      }
      unit.hitPoints = Math.max(Math.min(unit.hitPoints, oldUnit.maxHitPoints), 0)
      if (isHorde(unit)) {
        unit.members = splitHorde(unit)
        unit.name = getHordeName(unit.members)
      }
      Object.assign(oldUnit, unit)
    },
    updateUnitColors(state, unitColors) {
      state.unitColors.length = 0
      state.unitColors.push(...unitColors)
    },
  },
  actions: {
    initializeCombat({ commit, rootState }, { enemies, allies }) {
      commit('clear')
      const unitColors = [...defaultUnitColors]
      const enemyUnits = enemies.reduce((monsters, enemy) => {
        const monster = rootState.campaign.monsters.find(monster => monster.name === enemy.name)
        if (!monster) {
          throw new Error(`Monster ${enemy.name} not found`)
        }
        return monsters.concat(
          Array(enemy.quantity)
            .fill(null)
            .map(_i => createUnitFromCreature(monster, 'enemy', unitColors))
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
            .map(_i => createUnitFromCreature(monster, 'ally', unitColors))
        )
      }, [])
      const grid = getEmptyGrid()
      commit('setGrid', grid)
      const characterUnits = rootState.party.characters.map(character =>
        createUnitFromCreature(character, 'character', unitColors)
      )
      const units = [...characterUnits, ...enemyUnits, ...allyUnits]
      commit('updateUnits', units)
      commit(
        'setTurnOrder',
        units.map(unit => unit.id)
      )
      commit('setUnitIdInTurn', units[0].id)
      commit('updateUnitColors', unitColors)
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
            unit => !(unit.monster?.passives?.some(passive => passive.name === 'Swarm') ?? false)
          ).length > 1
        if (hasAtLeastTwoNonSwarmUnits) {
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
    addUnits({ commit, state }, unitBatches) {
      let newUnits = []
      const unitColors = [...state.unitColors]
      for (const unitBatch of unitBatches) {
        let unitBatchUnits = Array(unitBatch.quantity)
          .fill(null)
          .map(_i => createUnitFromCreature(unitBatch.creature, unitBatch.unitType, unitColors))
        if (unitBatch.asHorde) {
          unitBatchUnits = [createHorde(unitBatchUnits)]
        }
        newUnits = newUnits.concat(unitBatchUnits)
      }
      commit('updateUnits', [...state.units, ...newUnits])
      commit('updateUnitColors', unitColors)
    },
    updateUnit({ commit }, unit) {
      commit('updateUnit', unit)
    },
    removeUnits({ commit, state }, unitIds) {
      const removedUnits = state.units.filter(unit => unitIds.includes(unit.id))
      const unitColors = [...state.unitColors]
      commit(
        'updateUnits',
        state.units.filter(unit => !removedUnits.find(removedUnit => removedUnit.id === unit.id))
      )
      const colorsOfRemovedUnits = removedUnits.map(unit => unit.color)
      for (const removedUnitColor of colorsOfRemovedUnits) {
        unitColors.find(unitColor => unitColor.color === removedUnitColor).isUsed = false
      }
      commit('updateUnitColors', unitColors)
    },
    addCondition({ commit, state, rootState }, { unitId, conditionName }) {
      const unit = state.units.find(unit => unit.id === unitId)
      if (!unit) {
        throw new Error(`Unit with id ${unitId} not found`)
      }
      if (unit.conditions.find(condition => condition.name === conditionName)) {
        return
      }
      const condition = rootState.campaign.conditions.find(condition => condition.name === conditionName)
      if (!condition) {
        throw new Error(`Condition ${conditionName} not found`)
      }
      unit.conditions.push(condition)
      commit('updateUnits', state.units)
    },
    removeCondition({ commit, state }, { unitId, conditionName }) {
      const unit = state.units.find(unit => unit.id === unitId)
      if (!unit) {
        throw new Error(`unit with id ${unitId} not found`)
      }
      unit.conditions = unit.conditions.filter(condition => condition.name !== conditionName)
      commit('updateUnits', state.units)
    },
    convertSelectedToHorde({ commit, state }) {
      const selectedUnits = state.units.filter(unit => unit.selected)
      commit('updateUnits', [
        ...state.units.filter(unit => !unit.selected),
        { ...createHorde(selectedUnits), selected: true },
      ])
    },
    splitHorde({ commit, state, getters }, hordeId) {
      const horde = state.units.find(unit => unit.id === hordeId && getters.isHorde(unit))
      if (!horde) {
        throw new Error(`Horde unit with id ${hordeId} not found`)
      }
      commit('updateUnits', [...state.units.filter(unit => unit.id !== hordeId), ...splitHorde(horde)])
    },
  },
})
