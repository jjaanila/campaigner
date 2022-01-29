<template>
  <div class="ability-score">
    <span class="ability-score-name">{{name}}</span>
    <span class="ability-score-value">{{value}} ({{abilityModifier}})</span>
  </div>
</template>

<script>
export default {
  name: 'AbilityScore',
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  computed: {
    abilityModifier() {
      const abilityModifier = Math.floor((this.value - 10) / 2)
      return `${abilityModifier > 0 ? '+' : ''}${abilityModifier}`
    }
  }
}
</script>

<style>
.ability-score {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}
.ability-score-name {
  font-weight: bold;
}
</style>
