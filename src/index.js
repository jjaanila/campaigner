import { createApp } from 'vue'
import components from './components'
import { createStore } from './stores/'
import 'regenerator-runtime/runtime'

export * from './components'

export const createCampaign = appComponent => {
  const app = createApp(appComponent)
  app.use(createStore())
  Object.keys(components).forEach(key => {
    app.component(key, components[key])
  })
  return app
}
