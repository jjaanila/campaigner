import { encounterDifficulties } from '../tables'

export const LOCAL_STORAGE_STATE_KEY = 'campaigner-party'

const updateEncounterLimits = state => {
  state.encounterLimits = state.characters.reduce(
    (limits, character) => {
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

const initializeFromLocalStorage = () => {
  const state = JSON.parse(localStorage.getItem(LOCAL_STORAGE_STATE_KEY))
  return state
    ? state
    : {
        characters: [],
        encounterLimits: {
          easy: 0,
          medium: 0,
          hard: 0,
          deadly: 0,
        },
      }
}

const storeConfig = {
  namespaced: true,
  state: initializeFromLocalStorage(),
  mutations: {
    saveToLocalStorage(state) {
      localStorage.setItem(LOCAL_STORAGE_STATE_KEY, JSON.stringify({ ...state }))
    },
    updateEncounterLimits,
    setCharacters(state, characters) {
      state.characters = characters
    },
  },
  actions: {
    setCharacterName({ commit, state }, oldName, newName) {
      const character = state.characters.find(character => character.name === oldName)
      character.name = newName
      commit('setCharacters', state.characters)
    },
    setCharacterLevel({ commit, state }, name, level) {
      const character = state.characters.find(character => character.name === name)
      character.level = level
      commit('setCharacters', state.characters)
      commit('updateEncounterLimits')
    },
    addCharacter({ commit, state }) {
      commit('setCharacters', [...state.characters, { name: '', level: 1 }])
      commit('updateEncounterLimits')
    },
    removeCharacter({ commit, state }, name) {
      const characterIndex = state.characters.findIndex(character => character.name === name)
      if (characterIndex === -1) {
        throw new Error(`Character ${name} not found`)
      }
      state.characters.splice(characterIndex, 1)
      commit('setCharacters', state.characters)
      commit('updateEncounterLimits')
    },
  },
}

export default storeConfig
