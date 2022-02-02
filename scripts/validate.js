const campaignJson = require('../campaign')
const validate = require('jsonschema').validate
const CampaignSchema = require('../src/schemas/campaign.json')

validate(campaignJson, CampaignSchema, { throwAll: true })
console.log('\ncampaign.json is valid!')
