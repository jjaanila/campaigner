import Vue from 'vue'

export default {
  state: Vue.observable({
    isToCOpen: true,
    showTocAlways: false,
  }),
  toggleToC() {
    if (this.state.showTocAlways && this.state.isToCOpen) {
      return
    }
    this.state.isToCOpen = !this.state.isToCOpen
  },
  closeToC() {
    if (this.state.showTocAlways) {
      return
    }
    this.state.isToCOpen = false
  },
}
