import Vue from 'vue'
import App from './App.vue'
import components from './components'
import campaignStore from './stores/campaign.store'
import uiStore from './stores/ui.store'
import partyStore from './stores/party.store'

Object.keys(components).forEach(key => {
  Vue.component(key, components[key])
})

new Vue({
  el: '#app',
  render: h => h(App),
  provide: {
    campaignStore,
    uiStore,
    partyStore,
  },
})
