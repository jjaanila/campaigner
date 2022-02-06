import Vue from 'vue'

import App from './App.vue'
import components from './components'
import store from './stores/'

Vue.config.productionTip = false

Object.keys(components).forEach(key => {
  Vue.component(key, components[key])
})

new Vue({
  store,
  el: '#app',
  render: h => h(App),
})
