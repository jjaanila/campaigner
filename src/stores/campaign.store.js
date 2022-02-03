import Vue from 'vue'

import campaignJson from '../../campaign'
import { sortByKey } from '../utils'
import { parseCampaign } from '../parser'
const campaign = parseCampaign(campaignJson)

export default {
  state: Vue.observable({
    ...campaign,
    monsters: sortByKey(campaign.monsters, 'name'),
  }),
}
