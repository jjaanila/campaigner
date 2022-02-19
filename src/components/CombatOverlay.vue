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
        <table>
          <tr v-for="(row, y) in grid" :key="y">
            <td
              v-for="(cell, x) in row"
              :key="x"
              :class="cell.units.length > 1 ? 'combat-cell many' : 'combat-cell'"
              @drop="onDropOnCell($event, { x, y })"
              @dragover.prevent
              @dragenter.prevent
            >
              <combat-enemy
                v-for="unit in cell.units.filter(u => u.unitType === 'enemy')"
                :key="unit.id"
                draggable="true"
                :monster="unit"
                @dragstart="onUnitDragStart($event, unit, { x, y })"
              />
              <combat-character
                v-for="unit in cell.units.filter(u => u.unitType === 'character')"
                :key="unit.id"
                draggable="true"
                :character="unit"
                @dragstart="onUnitDragStart($event, unit, { x, y })"
              />
              <combat-ally
                v-for="unit in cell.units.filter(u => u.unitType === 'ally')"
                :key="unit.id"
                draggable="true"
                :monster="unit"
                @dragstart="onUnitDragStart($event, unit, { x, y })"
              />
              <div v-if="!cell.units.length" class="combat-empty-cell" />
            </td>
          </tr>
        </table>
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
import { mapState, mapActions } from 'vuex'
import CombatAlly from './CombatAlly.vue'
import CombatEnemy from './CombatEnemy.vue'
import CombatCharacter from './CombatCharacter.vue'
import CombatTurnOrder from './CombatTurnOrder.vue'
export default {
  name: 'CombatOverlay',
  components: {
    CombatAlly,
    CombatEnemy,
    CombatCharacter,
    CombatTurnOrder,
  },
  data() {
    return {
      backgroundImage: require('../img/paper.jpg'),
    }
  },
  computed: {
    ...mapState({
      isCombatOverlayOpen: state => state.ui.isCombatOverlayOpen,
      characters: state => state.party.characters,
      isInCombat: state => state.combat.isInCombat,
      enemies: state => state.combat.enemies,
      allies: state => state.combat.allies,
      grid: state => state.combat.grid,
      units: state => state.combat.units,
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
      const unitRef = this.units.find(u => unit.id === u.id)
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
  align-items: center;
}
.combat-turn-order {
  margin-bottom: 1rem;
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
