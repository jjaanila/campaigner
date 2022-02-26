<template>
  <div class="combat-unit-details-list-container">
    <button
      v-if="canConvertSelectedToHorde"
      class="combat-convert-to-horde-button"
      @click="convertSelectedToHorde()"
    >
      Convert to Horde
    </button>
    <ul class="combat-unit-details-list">
      <li v-for="unit in selectedMonsters" :key="unit.id">
        <combat-unit-details :unit="unit" />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
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
    ...mapGetters('combat', ['selectedUnits', 'canConvertSelectedToHorde']),
    selectedMonsters() {
      return this.selectedUnits.filter(unit => unit.selected && unit.unitType !== 'character')
    },
  },
  methods: {
    ...mapActions('combat', ['convertSelectedToHorde']),
  },
}
</script>

<style scoped>
.combat-unit-details-list-container {
  display: flex;
  flex-flow: column;
  align-items: flex-end;
}
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
.combat-convert-to-horde-button {
  margin: 0.5rem;
}
</style>
