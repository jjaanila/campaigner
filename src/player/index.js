import Vue from 'vue'
import store from '../stores/'
import Player from './Player.vue'

Vue.config.productionTip = false

new Vue({
  store,
  el: '#app',
  render: h => h(Player),
})
