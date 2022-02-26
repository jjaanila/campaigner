import Vue from 'vue'
import Vuex from 'vuex'
import getPartyModule, { LOCAL_STORAGE_STATE_KEY as PARTY_LOCAL_STORAGE_STATE_KEY } from './party.store'
import getCampaignModule from './campaign.store'
import uiStore from './ui.store'
import getCombatModule, { LOCAL_STORAGE_STATE_KEY as COMBAT_LOCAL_STORAGE_STATE_KEY } from './combat.store'
import { initialize as initializeSync } from '../sync'
import { GoogleDriveStorage } from '../sync/GoogleDriveStorage'

export const createStore = (options = {}) => {
  Vue.use(Vuex)
  const store = new Vuex.Store({
    modules: {
      party: getPartyModule(),
      campaign: getCampaignModule(),
      ui: uiStore,
      combat: getCombatModule(),
    },
  })

  if (options?.sync?.storage === 'googleDrive') {
    initializeSync(store, new GoogleDriveStorage(options.sync.storageConfig))
  }

  store.subscribe((mutation, state) => {
    if (localStorage) {
      localStorage.setItem(PARTY_LOCAL_STORAGE_STATE_KEY, JSON.stringify(state.party))
      localStorage.setItem(COMBAT_LOCAL_STORAGE_STATE_KEY, JSON.stringify(state.combat))
    }
  })
  return store
}
