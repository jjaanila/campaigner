import campaignJson from '../../campaign'
import { sortByKey } from '../utils'
import { parseCampaign } from '../parser'

const campaign = parseCampaign(campaignJson)

export default {
  namespaced: true,
  state: { ...campaign, monsters: sortByKey(campaign.monsters, 'name') },
}
