<template>
  <div :id="containerId" class="monster">
    <span class="monster-name">{{ name }}</span>
    <div class="monster-left">
      <span class="monster-properties">{{ propertiesStr }}</span>
      <monster-stat-row label="Armor Class" :value="armorClass" />
      <monster-stat-row label="Hit Points" :value="hitPointsStr" />
      <monster-stat-row label="Speed" :value="speed" />
      <p class="monster-description">{{ description }}</p>
      <div class="monster-ability-scores">
        <ability-score name="STR" :value="strength" />
        <ability-score name="DEX" :value="dexterity" />
        <ability-score name="CON" :value="constitution" />
        <ability-score name="INT" :value="intelligence" />
        <ability-score name="WIS" :value="wisdom" />
        <ability-score name="CHA" :value="charisma" />
      </div>
    </div>
    <div class="monster-right"></div>
  </div>
</template>

<script>
import { generateId } from '../utils'
import MonsterStatRow from './MonsterStatRow.vue'
import AbilityScore from './AbilityScore.vue'
import Dice from '../Dice'
export default {
  name: 'Monster',
  components: {
    'monster-stat-row': MonsterStatRow,
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
    id: {
      type: String,
    },
  },
  computed: {
    containerId() {
      return this.id ?? generateId(this.name, 'monster')
    },
    speed() {
      return `${this.speedFt} ft.`
    },
    propertiesStr() {
      return `${this.size[0].toUpperCase() + this.size.substring(1)} ${this.type ? ' ' + this.type : ''}${
        this.race ? ', ' + this.race : ''
      }${this.alignment ? ', ' + this.alignment : ''}`
    },
    hitPointsStr() {
      return this.hitPoints.toString()
    },
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
  border-top: 3px double #59190d;
  border-bottom: 3px double #59190d;
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
}
.monster-ability-scores {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
}
</style>
