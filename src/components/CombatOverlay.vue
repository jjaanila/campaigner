<template>
  <div>
    <div v-if="isCombatOverlayOpen" class="combat-overlay">
      <div class="combat-overlay-mask" @click="setIsCombatOverlayOpen(false)" />
      <div
        class="combat-overlay-content"
        :style="{
          background: `url(${backgroundImage})`,
        }"
      >
        <combat-turn-order />
        <div class="board-container">
          <combat-unit-details-list />
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
                  draggable="true"
                  :unit="unit"
                  @dragstart="onUnitDragStart($event, unit, { x, y })"
                />
                <combat-character
                  v-for="unit in cell.units.filter(u => u.unitType === 'character')"
                  :key="unit.id"
                  draggable="true"
                  :unit="unit"
                  @dragstart="onUnitDragStart($event, unit, { x, y })"
                />
                <combat-ally
                  v-for="unit in cell.units.filter(u => u.unitType === 'ally')"
                  :key="unit.id"
                  draggable="true"
                  :unit="unit"
                  @dragstart="onUnitDragStart($event, unit, { x, y })"
                />
                <div v-if="!cell.units.length" class="combat-empty-cell" />
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <button
      v-if="!isCombatOverlayOpen && isInCombat"
      class="open-combat-overlay-button"
      @click="setIsCombatOverlayOpen(true)"
    >
      Open Combat Overlay
    </button>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import CombatAlly from './CombatAlly.vue'
import CombatEnemy from './CombatEnemy.vue'
import CombatCharacter from './CombatCharacter.vue'
import CombatTurnOrder from './CombatTurnOrder.vue'
import CombatUnitDetailsList from './CombatUnitDetailsList.vue'
export default {
  name: 'CombatOverlay',
  components: {
    CombatAlly,
    CombatEnemy,
    CombatCharacter,
    CombatTurnOrder,
    CombatUnitDetailsList,
  },
  data() {
    return {
      backgroundImage: require('../img/paper.jpg'),
    }
  },
  computed: {
    ...mapState({
      isCombatOverlayOpen: state => state.ui.isCombatOverlayOpen,
      isInCombat: state => state.combat.isInCombat,
      grid: state => state.combat.grid,
      units: state => state.combat.units,
    }),
    ...mapGetters({
      enemies: 'combat/enemies',
      characters: 'combat/characters',
      allies: 'combat/allies',
      getUnitById: 'combat/getUnitById',
    }),
  },
  methods: {
    ...mapActions('ui', ['setIsCombatOverlayOpen']),
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
.combat-overlay {
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.combat-overlay-mask {
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  z-index: 1;
}
.combat-overlay-content {
  display: flex;
  flex-flow: column nowrap;
  position: fixed;
  right: 5rem;
  top: 1rem;
  width: calc(100% - 10rem);
  height: calc(100% - 2rem);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.combat-turn-order {
  margin: 1rem;
}
.board-container {
  position: relative;
  max-height: 80%;
  display: flex;
  flex-flow: row nowrap;
}
.open-combat-overlay-button {
  position: fixed;
  bottom: 0.5rem;
  right: 0.5rem;
}
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
}
tr,
th,
td {
  border: 1px solid gray;
  padding: 0;
  margin: 0;
}
td {
  height: 1.5rem;
  width: 1.5rem;
}
</style>
