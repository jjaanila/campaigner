import Vue from 'vue'
import App from './App.vue'
import components from './components'

Object.keys(components).forEach(key => {
  Vue.component(key, components[key])
})

new Vue({
  el: '#app',
  render: h => h(App),
})
