import { createStore as createVueXStore } from 'vuex'
import getPartyModule, { LOCAL_STORAGE_STATE_KEY as PARTY_LOCAL_STORAGE_STATE_KEY } from './party.store'
import getCampaignModule from './campaign.store'
import getCombatModule, { LOCAL_STORAGE_STATE_KEY as COMBAT_LOCAL_STORAGE_STATE_KEY } from './combat.store'
import getUIModule, { LOCAL_STORAGE_STATE_KEY as UI_LOCAL_STORAGE_STATE_KEY } from './ui.store'

export const createStore = () => {
  const store = createVueXStore({
    modules: {
      party: getPartyModule(),
      campaign: getCampaignModule(),
      ui: getUIModule(),
      combat: getCombatModule(),
    },
  })

  store.subscribe((mutation, state) => {
    if (localStorage) {
      localStorage.setItem(PARTY_LOCAL_STORAGE_STATE_KEY, JSON.stringify(state.party))
      localStorage.setItem(COMBAT_LOCAL_STORAGE_STATE_KEY, JSON.stringify(state.combat))
      localStorage.setItem(UI_LOCAL_STORAGE_STATE_KEY, JSON.stringify(state.ui))
    }
  })
  return store
}
