<template>
  <table>
    <tr v-for="(row, y) in grid" :key="y">
      <td
        v-for="(cell, x) in row"
        :key="x"
        :class="{ 'combat-cell': true, many: cell.units.length > 1 }"
        @drop="onDropOnCell($event, { x, y })"
        @dragover.prevent
        @dragenter.prevent
      >
        <combat-enemy
          v-for="unit in cell.units.filter(u => u.unitType === 'enemy')"
          :key="unit.id"
          class="unit"
          draggable="true"
          :unit="unit"
          @dragstart="onUnitDragStart($event, unit, { x, y })"
        />
        <combat-character
          v-for="unit in cell.units.filter(u => u.unitType === 'character')"
          :key="unit.id"
          class="unit"
          draggable="true"
          :unit="unit"
          @dragstart="onUnitDragStart($event, unit, { x, y })"
        />
        <combat-ally
          v-for="unit in cell.units.filter(u => u.unitType === 'ally')"
          :key="unit.id"
          class="unit"
          draggable="true"
          :unit="unit"
          @dragstart="onUnitDragStart($event, unit, { x, y })"
        />
        <div v-if="!cell.units.length" class="combat-empty-cell" />
      </td>
    </tr>
  </table>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import CombatAlly from './CombatAlly.vue'
import CombatEnemy from './CombatEnemy.vue'
import CombatCharacter from './CombatCharacter.vue'

export default {
  name: 'CombatGrid',
  components: {
    CombatAlly,
    CombatEnemy,
    CombatCharacter,
  },
  computed: {
    ...mapState({
      grid: state => state.combat.grid,
    }),
    ...mapGetters({
      getUnitById: 'combat/getUnitById',
    }),
  },
  methods: {
    ...mapActions('combat', ['moveUnit']),
    onUnitDragStart(event, unit, oldPosition) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('dragUnit', JSON.stringify({ unit, oldPosition }))
    },
    onDropOnCell(event, newPosition) {
      const { unit, oldPosition } = JSON.parse(event.dataTransfer.getData('dragUnit'))
      const unitRef = this.getUnitById(unit.id)
      if (!unitRef) {
        throw new Error(`Could not find unit with id ${unit.id}`)
      }
      this.moveUnit({ unit: unitRef, oldPosition, newPosition })
    },
  },
}
</script>

<style scoped>
.combat-cell.many {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
}
.combat-cell.many > .combat-unit {
  width: 0.75rem;
  height: 0.75rem;
  font-size: 0.5rem;
}
.combat-empty-cell {
  width: 100%;
  height: 100%;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
  padding: 0;
  margin: 0;
  table-layout: fixed;
  width: 1px; /* To prevent expansion of cells, condition for table-layout to work */
}
td {
  border: 1px solid gray;
  padding: 0;
  margin: 0;
}
td {
  height: 1.5rem;
  width: 1.5rem;
}
.unit {
  width: calc(1.5rem - 1px); /* Leave 1px space for td border */
  height: calc(1.5rem - 1px);
}
</style>
