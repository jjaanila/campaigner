import { createStore as createVueXStore } from 'vuex'
import getPartyModule, { LOCAL_STORAGE_STATE_KEY as PARTY_LOCAL_STORAGE_STATE_KEY } from './party.store'
import getCampaignModule from './campaign.store'
import uiStore from './ui.store'
import getCombatModule, { LOCAL_STORAGE_STATE_KEY as COMBAT_LOCAL_STORAGE_STATE_KEY } from './combat.store'

export const createStore = () => {
  const store = createVueXStore({
    modules: {
      party: getPartyModule(),
      campaign: getCampaignModule(),
      ui: uiStore,
      combat: getCombatModule(),
    },
  })

  store.subscribe((mutation, state) => {
    if (localStorage) {
      localStorage.setItem(PARTY_LOCAL_STORAGE_STATE_KEY, JSON.stringify(state.party))
      localStorage.setItem(COMBAT_LOCAL_STORAGE_STATE_KEY, JSON.stringify(state.combat))
    }
  })
  return store
}
