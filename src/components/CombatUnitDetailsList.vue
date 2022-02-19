<template>
  <ul class="combat-unit-details-list">
    <li v-for="unit in selectedUnits" :key="unit.id">
      <combat-unit-details :unit="unit" />
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex'
import CombatUnitDetails from './CombatUnitDetails.vue'
export default {
  name: 'CombatUnitList',
  components: {
    CombatUnitDetails,
  },
  computed: {
    ...mapState({
      units: state => state.combat.units,
    }),
    selectedUnits() {
      return this.units.filter(unit => unit.selected && unit.unitType !== 'character')
    },
  },
}
</script>

<style scoped>
.combat-unit-details-list {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  list-style: none;
  margin: 0 0.5rem 0 0;
  padding: 0;
}
.combat-unit-details-list > li {
  width: 100%;
  margin-bottom: 0.25rem;
}
</style>
