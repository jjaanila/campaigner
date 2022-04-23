<template>
  <div :id="containerId" class="monster">
    <span class="monster-name" tabindex="0">{{ name }}</span>
    <span class="monster-properties" tabindex="0">{{ propertiesStr }}</span>
    <p v-if="description" class="monster-description" tabindex="0">
      {{ description }}
    </p>
    <monster-divider />
    <monster-stat-row label="Armor Class" :value="armorClassStr" />
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
    <monster-stat-row class="monster-saving-throws" label="Saving Throws" :value="savingThrowsStr" />
    <monster-stat-row class="monster-skills" label="Skills" :value="skillsStr" />
    <monster-stat-row
      class="monster-damage-resistances"
      label="Damage Resistances"
      :value="damageResistancesStr"
    />
    <monster-stat-row
      class="monster-damage-immunities"
      label="Damage Immunities"
      :value="damageImmunitiesStr"
    />
    <monster-stat-row
      class="monster-condition-immunities"
      label="Condition Immunities"
      :value="conditionImmunitiesStr"
    />
    <monster-stat-row class="monster-senses" label="Senses" :value="sensesStr" />
    <monster-stat-row class="monster-languages" label="Languages" :value="languagesStr" />
    <monster-stat-row class="monster-challenge-rating" label="Challenge" :value="challengeRatingStr" />
    <monster-divider />
    <monster-action v-for="passive in passives" :key="passive.name" v-bind="passive" />
    <monster-section-header v-if="actions.length > 0" name="Actions" />
    <monster-action v-for="action in actions" :key="action.name" v-bind="action" />
    <monster-section-header v-if="reactions.length > 0" name="Reactions" />
    <monster-action v-for="reaction in reactions" :key="reaction.name" v-bind="reaction" />
  </div>
</template>

<script>
import { capitalize, getAbilityScoreModifier } from '../utils'
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
    armor: {
      type: String,
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
      required: true,
    },
    xp: {
      type: Number,
      required: true,
    },
    savingThrows: {
      type: Array,
      default: () => [],
    },
    skills: {
      type: Array,
      default: () => [],
    },
    senses: {
      type: Array,
      default: () => [],
    },
    damageResistances: {
      type: Array,
      default: () => [],
    },
    damageImmunities: {
      type: Array,
      default: () => [],
    },
    conditionImmunities: {
      type: Array,
      default: () => [],
    },
    languages: {
      type: Array,
      default: () => [],
    },
    id: {
      type: String,
    },
    passives: {
      type: Array,
      default: () => [],
    },
    actions: {
      type: Array,
      default: () => [],
    },
    reactions: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    containerId() {
      return this.id
    },
    armorClassStr() {
      return `${this.armorClass}${this.armor ? ` (${this.armor})` : ''}`
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
    savingThrowsStr() {
      return this.savingThrows.map(capitalize).join(', ')
    },
    skillsStr() {
      return this.skills
        .map(
          skillObject =>
            `${capitalize(skillObject.name)} ${skillObject.modifier > 0 ? '+' : ''}${skillObject.modifier}`
        )
        .join(', ')
    },
    damageResistancesStr() {
      return this.damageResistances.map(str => str.toLowerCase()).join(', ')
    },
    damageImmunitiesStr() {
      return this.damageImmunities.map(str => str.toLowerCase()).join(', ')
    },
    conditionImmunitiesStr() {
      return this.conditionImmunities.map(str => str.toLowerCase()).join(', ')
    },
    passivePerception() {
      const skillModifier = this.skills.find(skill => skill.name === 'perception')?.modifier ?? 0
      return 10 + getAbilityScoreModifier(this.wisdom) + skillModifier
    },
    sensesStr() {
      return [
        `Passive Perception ${this.passivePerception}`,
        ...this.senses.map(sense => `${capitalize(sense.name)} ${sense.value}ft. ${sense.extra ?? ''}`),
      ].join(', ')
    },
    languagesStr() {
      return this.languages.map(capitalize).join(', ')
    },
    challengeRatingStr() {
      let cr = 'N/A'
      switch (this.challengeRating) {
        case 0.125:
          cr = '1/8'
          break
        case 0.25:
          cr = '1/4'
          break
        case 0.5:
          cr = '1/2'
          break
        default:
          isInteger(this.challengeRating)
          cr = String(this.challengeRating)
          break
      }
      return `${cr} (${this.xp} XP)`
    },
  },
}
</script>

<style scoped>
.monster {
  margin: 1rem 0;
  background-color: #fdf1dc;
  padding: 0.5rem;
  border-top: 4px double #59190d;
  border-bottom: 4px double #59190d;
  font-size: 0.75rem;
  column-count: 2;
  column-fill: auto;
}
.monster-name {
  text-indent: 0;
  display: block;
  font-weight: bold;
  font-size: 1.25rem;
  color: #58180d;
}
.monster-properties {
  font-style: italic;
}
.monster-description {
  text-indent: 0;
  margin: 0.25rem 0 0.25rem 0;
  font-style: italic;
}
.monster-ability-scores {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  margin: 0.25rem 0;
  break-inside: avoid-column;
  -webkit-column-break-inside: avoid;
}
.monster-challenge-rating {
  margin-bottom: 0.25rem;
}
</style>
