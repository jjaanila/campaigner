import { encounterDifficulties } from '../tables'
import { getUniqueId } from '../utils'

export const LOCAL_STORAGE_STATE_KEY = 'campaigner-party'

const updateEncounterLimits = state => {
  state.encounterLimits = state.characters.reduce(
    (limits, character) => {
      if (typeof character.level !== 'number') {
        return limits
      }
      const characterLimits = encounterDifficulties.find(ed => ed.characterLevel === character.level)
      if (!characterLimits) {
        throw new Error('Did not find character limits for character level ' + character.level)
      }
      limits.easy += characterLimits.easy
      limits.medium += characterLimits.medium
      limits.hard += characterLimits.hard
      limits.deadly += characterLimits.deadly
      return limits
    },
    { easy: 0, medium: 0, hard: 0, deadly: 0 }
  )
  return state
}

const migrateState = state => {
  state.characters.forEach(character => (character.conditions ??= []))
  state.characters.forEach(character => (character.inventory ??= ''))
  state.characters.forEach(character => (character.id ??= getUniqueId()))
  state.notebook ??= {}
  return state
}

const initializeFromLocalStorage = () => {
  const state = JSON.parse(localStorage.getItem(LOCAL_STORAGE_STATE_KEY))
  return state
    ? updateEncounterLimits(migrateState(state))
    : {
        characters: [],
        notebook: {},
        encounterLimits: {
          easy: 0,
          medium: 0,
          hard: 0,
          deadly: 0,
        },
      }
}

export default () => ({
  namespaced: true,
  state: initializeFromLocalStorage(),
  mutations: {
    updateEncounterLimits,
    setCharacters(state, characters) {
      state.characters = characters
      updateEncounterLimits(state)
    },
    updateRecord(state, record) {
      if (state.notebook[record.id]) {
        Object.assign(state.notebook[record.id], record)
      } else {
        record.createdAt = new Date().toISOString()
        state.notebook[record.id] = record
      }
    },
    deleteRecord(state, recordId) {
      if (state.notebook[recordId]) {
        delete state.notebook[recordId]
      }
    },
  },
  actions: {
    addCharacter({ commit, state }) {
      commit('setCharacters', [
        ...state.characters,
        {
          name: '',
          id: getUniqueId(),
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
      commit('updateEncounterLimits')
    },
    removeCharacter({ commit, state }, id) {
      const characterIndex = state.characters.findIndex(character => character.id === id)
      if (characterIndex === -1) {
        throw new Error(`Character with id ${id} not found`)
      }
      if (!confirm(`Do you really want to remove ${state.characters[characterIndex].name}?`)) {
        return
      }
      state.characters.splice(characterIndex, 1)
      commit('setCharacters', state.characters)
      commit('updateEncounterLimits')
    },
    updateCharacters({ commit }) {
      commit('updateEncounterLimits')
    },
    addCondition({ commit, state, rootState }, { characterId, conditionName }) {
      const character = state.characters.find(character => character.id === characterId)
      if (!character) {
        throw new Error(`Character with id ${characterId} not found`)
      }
      if (character.conditions.find(condition => condition.name === conditionName)) {
        return
      }
      const condition = rootState.campaign.conditions.find(condition => condition.name === conditionName)
      if (!condition) {
        throw new Error(`Condition ${conditionName} not found`)
      }
      character.conditions.push(condition)
      commit('setCharacters', state.characters)
    },
    removeCondition({ commit, state }, { characterId, conditionName }) {
      const character = state.characters.find(character => character.id === characterId)
      if (!character) {
        throw new Error(`Character with id ${characterId} not found`)
      }
      character.conditions = character.conditions.filter(condition => condition.name !== conditionName)
      commit('setCharacters', state.characters)
    },
    updateCharacterInventory({ commit, state }, { characterId, inventory }) {
      const character = state.characters.find(character => character.id === characterId)
      if (!character) {
        throw new Error(`Character with id ${characterId} not found`)
      }
      character.inventory = inventory
      commit('setCharacters', state.characters)
    },
    updateRecord({ commit }, record) {
      commit('updateRecord', record)
    },
    deleteRecord({ commit }, recordId) {
      commit('deleteRecord', recordId)
    },
  },
})
