export const LOCAL_STORAGE_STATE_KEY = 'campaigner-combat'

const initializeFromLocalStorage = () => {
  const state = JSON.parse(localStorage.getItem(LOCAL_STORAGE_STATE_KEY))
  return state
    ? state
    : {
        enemies: [],
        allies: [],
        isInCombat: false,
      }
}

const storeConfig = {
  namespaced: true,
  state: initializeFromLocalStorage(),
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
    initializeCombat({ commit }, { enemies, allies }) {
      commit('setEnemies', enemies)
      commit('setAllies', allies)
    },
    setIsInCombat({ commit }, value) {
      commit('setIsInCombat', value)
    },
  },
}

export default storeConfig
