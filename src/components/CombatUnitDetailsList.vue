<template>
  <div class="combat-unit-details-list-container">
    <button
      v-if="selectedUnits.length && !unitRows.length"
      class="combat-unit-details-list-action combat-remove-units-button"
      @click="confirmAndRemoveUnits()"
    >
      Remove units
    </button>
    <button
      v-if="!unitRows.length"
      class="combat-unit-details-list-action combat-add-units-button"
      @click="unitRows.push({ quantity: 1, creature: undefined, unitType: 'enemy' })"
    >
      Add new units
    </button>
    <button
      v-if="canConvertSelectedToHorde && !unitRows.length"
      class="combat-unit-details-list-action combat-convert-to-horde-button"
      @click="convertSelectedToHorde()"
    >
      Convert to Horde
    </button>
    <ul v-if="!unitRows.length" class="combat-unit-details-list">
      <li v-for="unit in selectedMonsters" :key="unit.id">
        <combat-unit-details :unit="unit" />
      </li>
    </ul>
    <div v-if="unitRows.length" class="combat-add-unit-container">
      <div v-for="(row, i) in unitRows" :key="i" class="combat-unit-row">
        <div class="combat-unit-row-first">
          <select v-model="row.unitType">
            <option value="enemy">Enemy</option>
            <option value="ally">Ally</option>
          </select>
          <input v-model="row.quantity" type="number" min="1" />
          <button @click="unitRows.splice(i, 1)">-</button>
        </div>
        <select v-model="row.creatureName">
          <option v-for="creature in addableCreatures" :key="`${creature.name}${creature.id}`">
            {{ creature.name }}
          </option>
        </select>
        <div>
          <input :id="`row-${i}-as-horde`" v-model="row.asHorde" type="checkbox" />
          <label :for="`row-${i}-as-horde`">As Horde</label>
        </div>
      </div>
      <button
        @click="unitRows.push({ unitType: 'enemy', creatureName: undefined, quantity: 1, asHorde: false })"
      >
        +
      </button>
      <button :disabled="!canCreateUnits" @click="createUnits()">Create units</button>
    </div>
  </div>
</template>

<script>
import sortBy from 'lodash/sortBy'
import { mapState, mapActions, mapGetters } from 'vuex'
import CombatUnitDetails from './CombatUnitDetails.vue'
export default {
  name: 'CombatUnitList',
  components: {
    CombatUnitDetails,
  },
  data() {
    return {
      unitRows: [],
    }
  },
  computed: {
    ...mapState({
      units: state => state.combat.units,
      monsters: state => state.campaign.monsters,
      characters: state => state.party.characters,
    }),
    ...mapGetters('combat', ['selectedUnits', 'canConvertSelectedToHorde']),
    selectedMonsters() {
      return this.selectedUnits.filter(unit => unit.selected && unit.unitType !== 'character')
    },
    addableCreatures() {
      return this.creatures.filter(monster => !this.units.some(unit => unit.id === monster.id))
    },
    creatures() {
      return sortBy(this.monsters, 'name')
    },
    canCreateUnits() {
      return this.unitRows.every(({ creatureName, quantity, unitType }) => {
        return creatureName && quantity && unitType
      })
    },
  },
  methods: {
    ...mapActions('combat', ['convertSelectedToHorde', 'addUnits', 'removeUnits']),
    createUnits() {
      this.addUnits(
        this.unitRows.map(({ quantity, creatureName, ...rest }) => {
          return {
            ...rest,
            quantity: parseInt(quantity),
            creature: this.creatures.find(creature => creature.name === creatureName),
          }
        })
      )
    },
    confirmAndRemoveUnits() {
      if (confirm(`Are you sure you want to remove these ${this.selectedUnits.length} units?`)) {
        this.removeUnits(this.selectedUnits.map(unit => unit.id))
      }
    },
  },
}
</script>

<style scoped>
.combat-unit-details-list-container {
  display: flex;
  flex-flow: column;
  align-items: flex-end;
  max-height: 100%;
  padding: 0.5rem;
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
.combat-unit-details-list-action {
  align-self: center;
  margin: 0.25rem;
}
.combat-add-unit-container {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
}
.combat-unit-row {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  margin: 0.5rem 0;
}
</style>
