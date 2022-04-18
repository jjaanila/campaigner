import Dice from '../Dice'
import { getUniqueId } from '../utils'

export default {
  namespaced: true,
  state: {
    isToCOpen: true,
    showToCAlways: true,
    isCombatOverlayOpen: false,
    hideToC: false,
    hideParty: false,
    hideDice: false,
    dice: {
      throws: 1,
      last: undefined,
      history: [],
    },
  },
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
      state.dice.last = { dice, result: dice.throw(), id: getUniqueId(), description }
      state.dice.history.unshift(state.dice.last)
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
}
