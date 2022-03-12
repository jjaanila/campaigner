import { createApp } from 'vue'
import { createStore } from '../stores/'
import Player from './Player.vue'

const app = createApp(Player)
app.use(createStore())
app.mount('#app')
