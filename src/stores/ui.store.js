import Dice from '../Dice'
import { getUniqueId } from '../utils'

export const LOCAL_STORAGE_STATE_KEY = 'campaigner-ui'

const migrateState = state => {
  state.hideToC ??= false
  state.hideParty ??= false
  state.hideDice ??= false
  delete state.dice.last
  return state
}

const getEmptyState = () => ({
  isToCOpen: true,
  showToCAlways: true,
  isCombatOverlayOpen: false,
  hideToC: false,
  hideParty: false,
  hideDice: false,
  dice: {
    throws: 1,
    history: [],
  },
})

const getInitialState = () => {
  try {
    const state = JSON.parse(localStorage.getItem(LOCAL_STORAGE_STATE_KEY))
    state.dice.history = state.dice.history.map(record => ({
      ...record,
      dice: Dice.deserialize(record.dice),
    }))
    return state ? migrateState(state) : getEmptyState()
  } catch (e) {
    return getEmptyState()
  }
}

export default () => ({
  namespaced: true,
  state: getInitialState(),
  mutations: {
    toggleToC(state) {
      if (state.showToCAlways && state.isToCOpen) {
        return
      }
      state.isToCOpen = !state.isToCOpen
    },
    closeToC(state) {
      if (state.showToCAlways) {
        return
      }
      state.isToCOpen = false
    },
    setShowToCAlways(state, showToCAlways) {
      state.showToCAlways = showToCAlways
    },
    setIsCombatOverlayOpen(state, isCombatOverlayOpen) {
      state.isCombatOverlayOpen = isCombatOverlayOpen
    },
    throwDice(state, { throws, sides, constant, description = '' }) {
      const dice = new Dice(throws, sides, constant)
      state.dice.history.unshift({ dice, result: dice.throw(), id: getUniqueId(), description })
    },
    setThrows(state, throws) {
      state.dice.throws = throws
    },
  },
  actions: {
    toggleToC({ commit }) {
      commit('toggleToC')
    },
    closeToC({ commit }) {
      commit('closeToC')
    },
    setShowToCAlways({ commit }, showToCAlways) {
      commit('setShowToCAlways', showToCAlways)
    },
    setIsCombatOverlayOpen({ commit }, isCombatOverlayOpen) {
      commit('setIsCombatOverlayOpen', isCombatOverlayOpen)
    },
    throwDice({ commit }, params) {
      commit('throwDice', params)
    },
    setThrows({ commit }, throws) {
      commit('setThrows', throws)
    },
  },
})
