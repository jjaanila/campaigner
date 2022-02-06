import Vue from 'vue'
import Vuex from 'vuex'
import partyStore, { LOCAL_STORAGE_STATE_KEY } from './party.store'
import campaignStore from './campaign.store'
import uiStore from './ui.store'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    party: partyStore,
    campaign: campaignStore,
    ui: uiStore,
  },
})

store.subscribe((mutation, state) => {
  localStorage.setItem(LOCAL_STORAGE_STATE_KEY, JSON.stringify(state.party))
})

export default store
