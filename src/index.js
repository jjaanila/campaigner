import { createApp } from 'vue'
import components from './components'
import { createStore } from './stores/'
import 'regenerator-runtime/runtime'
import ClickAway from 'vue3-click-away'

export * from './components'

export const createCampaign = appComponent => {
  const app = createApp(appComponent)
  app.use(ClickAway)
  app.use(createStore())
  Object.keys(components).forEach(key => {
    app.component(key, components[key])
  })
  return app
}
