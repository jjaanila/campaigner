import Vue from 'vue'
import Vuex from 'vuex'
import getPartyModule, { LOCAL_STORAGE_STATE_KEY as PARTY_LOCAL_STORAGE_STATE_KEY } from './party.store'
import campaignStore from './campaign.store'
import uiStore from './ui.store'
import combatStore, { LOCAL_STORAGE_STATE_KEY as COMBAT_LOCAL_STORAGE_STATE_KEY } from './combat.store'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    party: getPartyModule(),
    campaign: campaignStore,
    ui: uiStore,
    combat: combatStore,
  },
})

store.subscribe((mutation, state) => {
  if (localStorage) {
    localStorage.setItem(PARTY_LOCAL_STORAGE_STATE_KEY, JSON.stringify(state.party))
    localStorage.setItem(COMBAT_LOCAL_STORAGE_STATE_KEY, JSON.stringify(state.combat))
  }
})

export default store
