import Vue from 'vue'
import App from './App.vue'
import components from './components'
import campaignStore from './stores/campaign.store'

Object.keys(components).forEach(key => {
  Vue.component(key, components[key])
})

new Vue({
  el: '#app',
  render: h => h(App),
  provide: {
    campaignStore,
  },
})
