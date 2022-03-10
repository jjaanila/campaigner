import Vue from 'vue'
import components from './components'
import { createStore } from './stores/'
import 'regenerator-runtime/runtime'

export * from './components'

export const createCampaign = app => {
  Vue.config.productionTip = false

  Object.keys(components).forEach(key => {
    Vue.component(key, components[key])
  })

  return new Vue({
    store: createStore(),
    el: '#app',
    render: h => h(app),
  })
}
