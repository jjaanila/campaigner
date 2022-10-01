import { getUniqueId } from '../utils'
import Dice from '../Dice'
import { distinguishableColors } from '../tables'

export const LOCAL_STORAGE_STATE_KEY = 'campaigner-combat'

export const GRID_WIDTH = 30
export const GRID_HEIGHT = 30
const GRID_LAST_X = GRID_WIDTH - 1
const GRID_LAST_Y = GRID_HEIGHT - 1
const defaultUnitColors = distinguishableColors.map(color => ({ color, isUsed: false }))

const migrateState = state => {
  delete state.grid
  state.units ??= []
  state.units.forEach(unit => {
    if (unit.monster) {
      unit.monsterName = unit.monster.name
      delete unit.monster
    }
  })
  state.turnOrder ??= []
  state.unitColors ??= [...defaultUnitColors]
  return state
}

const getEmptyState = () => ({
  units: [],
  isInCombat: false,
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

const getUnitsInCell = (units, x, y) => {
  return units.filter(unit => unit.position && unit.position.x === x && unit.position.y === y)
}

const getClosestUnoccupiedCell = (units, x, y) => {
  let closestX = x
  let closestY = y
  let closestDistance = Infinity
  for (let i = 0; i < GRID_WIDTH; i++) {
    for (let j = 0; j < GRID_HEIGHT; j++) {
      if (getUnitsInCell(units, i, j).length === 0) {
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

const unpositionUnit = unit => {
  unit.position = undefined
}

const positionUnit = (unit, position) => {
  unit.position = position
}

const positionEnemy = (units, enemy) => {
  let x = getRandomInteger(0, GRID_LAST_X)
  let y = getRandomInteger(0, Math.ceil(GRID_LAST_Y / 2))

  if (getUnitsInCell(units, x, y).length) {
    const { closestX, closestY } = getClosestUnoccupiedCell(units, x, y)
    x = closestX
    y = closestY
  }
  positionUnit(enemy, { x, y })
}

const positionCharacter = (units, character) => {
  let x = getRandomInteger(0, GRID_LAST_X)
  let y = GRID_LAST_Y - 5

  if (getUnitsInCell(units, x, y).length) {
    const { closestX, closestY } = getClosestUnoccupiedCell(units, x, y)
    x = closestX
    y = closestY
  }
  positionUnit(character, { x, y })
}

const positionAlly = (units, ally) => {
  let x = getRandomInteger(0, GRID_LAST_X)
  let y = GRID_LAST_Y - 5

  if (getUnitsInCell(units, x, y).length) {
    const { closestX, closestY } = getClosestUnoccupiedCell(units, x, y)
    x = closestX
    y = closestY
  }
  positionUnit(ally, { x, y })
}

const positionUnits = (units, addedUnits) => {
  for (const unit of addedUnits) {
    switch (unit.unitType) {
      case 'character':
        positionCharacter(units, unit)
        continue
      case 'enemy':
        positionEnemy(units, unit)
        continue
      case 'ally':
        positionAlly(units, unit)
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
  `Horde of ${members.filter(member => member.hitPoints > 0).length} ${members[0].monsterName}`

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

const reserveUnitColor = unitColors => {
  const unitColor = unitColors.find(color => !color.isUsed) // We can run out of colors!
  if (unitColor === undefined) {
    return 'red'
  }
  unitColor.isUsed = true
  return unitColor.color
}

const freeUnitColors = (unitColors, colorsTobeFreed) => {
  for (const color of colorsTobeFreed) {
    const unitColor = unitColors.find(uc => uc.color === color)
    if (unitColor) {
      unitColor.isUsed = false
    }
  }
  return unitColors
}

const getMonsterByName = (rootState, monsterName) => {
  const monster = rootState.campaign.state.monsters.find(monster => monster.name === monsterName)
  if (!monster) {
    throw new Error(`Did not find monster ${monsterName}!`)
  }
  return monster
}

const createHorde = (rootState, units, unitColors) => {
  if (
    units.length < 1 ||
    !units.every(unit => unit.monsterName === units[0].monsterName && unit.unitType === units[0].unitType)
  ) {
    throw new Error('Horde must be made of multiple units of same monster type and name')
  }
  const monster = getMonsterByName(rootState, units[0].monsterName)
  const members = units.reduce((memo, unit) => memo.concat(isHorde(unit) ? splitHorde(unit) : [unit]), [])
  const hitPoints = units.reduce((totalHp, unit) => totalHp + unit.hitPoints, 0)
  const maxHitPoints = units.reduce((totalMaxHp, unit) => totalMaxHp + unit.maxHitPoints, 0)
  freeUnitColors(
    unitColors,
    members.map(member => member.color)
  )
  return {
    name: getHordeName(members),
    monsterName: monster.name,
    id: getUniqueId(),
    selected: true,
    maxHitPoints,
    hitPoints,
    unitType: units[0].unitType,
    conditions: [],
    members,
    color: reserveUnitColor(unitColors),
  }
}

const createUnitFromCreature = (monsterOrCharacter, unitType, unitColors) => {
  const maxHitPoints =
    monsterOrCharacter.hitPoints instanceof Dice
      ? monsterOrCharacter.hitPoints.throw()
      : monsterOrCharacter.hitPoints
  return {
    name: monsterOrCharacter.name,
    monsterName: ['enemy', 'ally'].includes(unitType) ? monsterOrCharacter.name : undefined,
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

const getUnitById = (state, id) => state.units.find(unit => unit.id === id)

const getNextInTurn = (unitIdInTurn, turnOrder) => {
  const inTurnIndex = turnOrder.findIndex(unit => unit.id === unitIdInTurn)
  return turnOrder[(inTurnIndex + 1) % turnOrder.length]
}

export default () => ({
  namespaced: true,
  state: getInitialState(),
  getters: {
    getUnitById: state => id => getUnitById(state, id),
    enemies: state => state.units.filter(unit => unit.unitType === 'enemy'),
    allies: state => state.units.filter(unit => unit.unitType === 'ally'),
    characters: state => state.units.filter(unit => unit.unitType === 'character'),
    selectedUnits: state => state.units.filter(unit => unit.selected),
    canConvertSelectedToHorde(state, getters) {
      return (
        getters.selectedUnits.length > 1 &&
        getters.selectedUnits.every(
          unit =>
            unit.monsterName === getters.selectedUnits[0].monsterName &&
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
    setTurnOrder(state, turnOrder) {
      state.turnOrder = turnOrder
    },
    setUnitIdInTurn(state, unitId) {
      state.unitIdInTurn = unitId
    },
    clear(state) {
      Object.assign(state, getEmptyState())
    },
    updateUnits(state, updatedUnits) {
      const deletedUnits = state.units.filter(unit => !updatedUnits.find(u => u.id === unit.id))
      const addedUnits = updatedUnits.filter(unit => !state.units.find(u => u.id === unit.id))
      const turnOrderWithAdded = [...state.turnOrder, ...addedUnits.map(unit => unit.id)]
      const newTurnOrder = turnOrderWithAdded.filter(unitId => !deletedUnits.some(unit => unit.id === unitId))
      let nextInTurn
      if (deletedUnits.some(unit => unit.id === state.unitIdInTurn)) {
        nextInTurn = getNextInTurn(state.unitIdInTurn, turnOrderWithAdded)
        while (deletedUnits.some(unit => unit.id === nextInTurn) && newTurnOrder.length) {
          nextInTurn = getNextInTurn(state.unitIdInTurn, turnOrderWithAdded)
        }
      }
      deletedUnits.forEach(unit => unpositionUnit(unit))
      state.turnOrder = newTurnOrder
      state.units = updatedUnits
      positionUnits(state.units, addedUnits)
      if (nextInTurn) {
        state.unitIdInTurn = nextInTurn
      }
    },
    moveUnit(_state, { unit, newPosition }) {
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
    initializeCombat({ commit, rootState, rootGetters }, { enemies, allies }) {
      commit('clear')
      const unitColors = [...defaultUnitColors]
      const enemyUnits = enemies.reduce((units, enemy) => {
        const monster = getMonsterByName(rootState, enemy.monsterName)
        if (!monster) {
          throw new Error(`Monster ${enemy.monsterName} not found`)
        }
        return units.concat(
          Array(enemy.quantity)
            .fill(null)
            .map(_i => createUnitFromCreature(monster, 'enemy', unitColors))
        )
      }, [])
      const allyUnits = allies.reduce((units, ally) => {
        const monster = getMonsterByName(rootState, ally.monsterName)
        if (!monster) {
          throw new Error(`Monster ${ally.name} not found`)
        }
        return units.concat(
          Array(ally.quantity)
            .fill(null)
            .map(_i => createUnitFromCreature(monster, 'ally', unitColors))
        )
      }, [])
      const characterUnits = rootGetters['party/enabledCharacters'].map(character =>
        createUnitFromCreature(character, 'character', unitColors)
      )
      const units = [...characterUnits, ...enemyUnits, ...allyUnits]
      commit('updateUnits', units)
      commit('setTurnOrder', [])
      commit('setUnitIdInTurn', undefined)
      commit('updateUnitColors', unitColors)
    },
    setIsInCombat({ commit }, value) {
      commit('setIsInCombat', value)
    },
    moveUnit({ commit, state, rootState }, { unit, oldPosition, newPosition }) {
      if (
        newPosition.x < 0 ||
        newPosition.x >= GRID_WIDTH ||
        newPosition.y < 0 ||
        newPosition.y >= GRID_HEIGHT
      ) {
        throw new Error(`Invalid position ${newPosition.x}, ${newPosition.y}`)
      }
      if (
        !getUnitsInCell(state.units, oldPosition.x, oldPosition.y).some(
          oldPosUnit => oldPosUnit.id === unit.id
        )
      ) {
        throw new Error(
          `Tried moving unit ${unit.id} from ${oldPosition.x}, ${oldPosition.y} to ${newPosition.x}, ${newPosition.y} but unit was not found`
        )
      }
      const unitsInNewCell = getUnitsInCell(state.units, newPosition.x, newPosition.y)
      if (unitsInNewCell.filter(u => u.id !== unit.id).length) {
        const hasAtLeastTwoNonSwarmUnits =
          [...unitsInNewCell, unit].filter(
            unit =>
              !(
                getMonsterByName(rootState, unit.monsterName)?.passives?.some(
                  passive => passive.name === 'Swarm'
                ) ?? false
              )
          ).length > 1
        if (hasAtLeastTwoNonSwarmUnits) {
          return
        }
      }
      commit('moveUnit', { unit, newPosition })
    },
    setTurnOrder({ commit }, turnOrder) {
      commit('setTurnOrder', turnOrder)
    },
    setUnitIdInTurn({ commit }, unitId) {
      commit('setUnitIdInTurn', unitId)
    },
    addUnits({ commit, state, rootState }, unitBatches) {
      let newUnits = []
      const unitColors = [...state.unitColors]
      for (const unitBatch of unitBatches) {
        let unitBatchUnits = Array(unitBatch.quantity)
          .fill(null)
          .map(_i => createUnitFromCreature(unitBatch.creature, unitBatch.unitType, unitColors))
        if (unitBatch.asHorde) {
          unitBatchUnits = [createHorde(rootState, unitBatchUnits, unitColors)]
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
        { ...createHorde(selectedUnits, state.unitColors), selected: true },
      ])
    },
    splitHorde({ commit, state }, hordeId) {
      const horde = state.units.find(unit => unit.id === hordeId && isHorde(unit))
      if (!horde) {
        throw new Error(`Horde unit with id ${hordeId} not found`)
      }
      commit('updateUnits', [...state.units.filter(unit => unit.id !== hordeId), ...splitHorde(horde)])
    },
  },
})
