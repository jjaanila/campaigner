<template>
  <div :id="containerId" class="monster">
    <span class="monster-name">{{ name }}</span>
    <div class="monster-left">
      <span class="monster-properties">{{ propertiesStr }}</span>
      <p class="monster-description">{{ description }}</p>
      <monster-divider />
      <monster-stat-row label="Armor Class" :value="armorClass" />
      <monster-stat-row label="Hit Points" :value="hitPointsStr" />
      <monster-stat-row label="Speed" :value="speed" />
      <monster-divider />
      <div class="monster-ability-scores">
        <ability-score name="STR" :value="strength" />
        <ability-score name="DEX" :value="dexterity" />
        <ability-score name="CON" :value="constitution" />
        <ability-score name="INT" :value="intelligence" />
        <ability-score name="WIS" :value="wisdom" />
        <ability-score name="CHA" :value="charisma" />
      </div>
      <monster-divider />
      <monster-stat-row class="monster-skills" label="Skills" :value="skillsStr" />
      <monster-stat-row class="monster-senses" label="Senses" :value="sensesStr" />
      <monster-stat-row class="monster-languages" label="Languages" :value="languagesStr" />
      <monster-stat-row class="monster-challenge-rating" label="Challenge" :value="challengeRatingStr" />
      <monster-divider />
      <monster-action v-for="passive in passives" :key="passive.name" :name="passive.name" :descriptiom="passive.description" />
      <monster-section-header name="Actions" v-if="actions.length > 0" />
      <monster-action v-for="action in actions" :key="action.name" :name="action.name" :descriptiom="action.description" />
      <monster-section-header name="Reactions" v-if="reactions.length > 0" />
      <monster-action v-for="reaction in reactions" :key="reaction.name" :name="reaction.name" :descriptiom="reaction.description" />
    </div>
    <div class="monster-right"></div>
  </div>
</template>

<script>
import { generateId, capitalize } from '../utils'
import MonsterStatRow from './MonsterStatRow.vue'
import AbilityScore from './AbilityScore.vue'
import MonsterSectionHeader from './MonsterSectionHeader.vue'
import MonsterAction from './MonsterAction.vue'
import MonsterDivider from './MonsterDivider.vue'
import Dice from '../Dice'
import { isInteger } from '../validators'
export default {
  name: 'Monster',
  components: {
    'monster-stat-row': MonsterStatRow,
    'monster-section-header': MonsterSectionHeader,
    'monster-action': MonsterAction,
    'monster-divider': MonsterDivider,
    'ability-score': AbilityScore,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    race: {
      type: String,
    },
    alignment: {
      type: String,
    },
    armorClass: {
      type: Number,
      required: true,
    },
    hitPoints: {
      type: [Number, Dice],
      required: true,
    },
    speedFt: {
      type: Number,
      required: true,
    },
    strength: {
      type: Number,
      required: true,
    },
    dexterity: {
      type: Number,
      required: true,
    },
    constitution: {
      type: Number,
      required: true,
    },
    intelligence: {
      type: Number,
      required: true,
    },
    wisdom: {
      type: Number,
      required: true,
    },
    charisma: {
      type: Number,
      required: true,
    },
    challengeRating: {
      type: Number,
      required: true
    },
    skills: {
      type: Array,
    },
    senses: {
      type: Array,
    },
    languages: {
      type: Array,
    },
    id: {
      type: String,
    },
    passives: {
      type: Array
    },
    actions: {
      type: Array
    },
    reactions: {
      type: Array
    }
  },
  computed: {
    containerId() {
      return this.id ?? generateId(this.name, 'monster')
    },
    speed() {
      return `${this.speedFt} ft.`
    },
    propertiesStr() {
      return `${capitalize(this.size)} ${this.type ? ' ' + this.type : ''}${
        this.race ? ', ' + this.race : ''
      }${this.alignment ? ', ' + this.alignment : ''}`
    },
    hitPointsStr() {
      return this.hitPoints.toString()
    },
    skillsStr() {
      return this.skills.map(skillObject => `${capitalize(skillObject.name)} ${skillObject.modifier > 0 ? '+' : ''}${skillObject.modifier}`).join(', ')
    },
    sensesStr() {
      return this.senses.join(', ')
    },
    languagesStr() {
      return this.languages.map(capitalize).join(', ')
    },
    challengeRatingStr() {
      switch (this.challengeRating){
        case 0.125:
          return '1/8'
        case 0.25:
          return '1/4'
        case 0.50:
          return '1/2'
        default:
          isInteger(this.challengeRating)
          return this.challengeRating
      }
    }
  },
}
</script>

<style scoped>
.monster {
  display: flex;
  flex-flow: column nowrap;
  margin: 1rem 0;
  background-color: #fdf1dc;
  padding: 0.5rem;
  border-top: 4px double #59190d;
  border-bottom: 4px double #59190d;
  font-size: 0.75rem;
}
.monster-left,.monster-right {
  width: 50%;
}
.monster-name {
  font-weight: bold;
  font-size: 1.25rem;
  color: #58180d;
}
.monster-properties {
  font-style: italic;
}
.monster-description {
  margin: 0.25rem 0 0.25rem 0;
  font-style: italic;
}
.monster-ability-scores {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  margin: 0.25rem 0;
}
.monster-challenge-rating {
  margin-bottom: 0.25rem;
}
</style>
