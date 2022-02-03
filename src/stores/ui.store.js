import Vue from 'vue'

export default {
  state: Vue.observable({
    isToCOpen: true,
  }),
  toggleToC() {
    this.state.isToCOpen = !this.state.isToCOpen
  },
  closeToC() {
    this.state.isToCOpen = false
  },
}
