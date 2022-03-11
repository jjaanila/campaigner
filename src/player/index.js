import Vue from 'vue'
import { createStore } from '../stores/'
import Player from './Player.vue'

Vue.config.productionTip = false

new Vue({
  store: createStore(),
  el: '#app',
  render: h => h(Player),
})
