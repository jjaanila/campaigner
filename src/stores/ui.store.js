export default {
  namespaced: true,
  state: { isToCOpen: true, showToCAlways: true, isCombatOverlayOpen: false },
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
  },
}
