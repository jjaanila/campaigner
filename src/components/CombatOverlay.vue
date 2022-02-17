<template>
  <div>
    <div v-if="isCombatOverlayOpen" class="combat-overlay">
      <div class="combat-overlay-mask" @click="setIsCombatOverlayOpen(false)" />
      <div
        class="combat-overlay-content"
        :style="{
          background: `url(${require('../img/paper.jpg')})`,
        }"
      >
        <table>
          <tr v-for="(row, y) in grid" :key="y">
            <td
              v-for="(cell, x) in row"
              :key="x"
              @drop="onDropOnCell($event, cell, { x, y })"
              @dragover.prevent
              @dragenter.prevent
            >
              <combat-enemy
                v-for="unit in cell.units.filter(u => u.type === 'enemy')"
                :key="unit.id"
                draggable="true"
                :monster="unit"
                @dragstart="onUnitDragStart($event, unit, { x, y })"
              />
              <combat-character
                v-for="unit in cell.units.filter(u => u.type === 'character')"
                :key="unit.id"
                draggable="true"
                :character="unit"
                @dragstart="onUnitDragStart($event, unit, { x, y })"
              />
              <combat-ally
                v-for="unit in cell.units.filter(u => u.type === 'ally')"
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
export default {
  name: 'CombatOverlay',
  components: {
    CombatAlly,
    CombatEnemy,
    CombatCharacter,
  },
  computed: {
    ...mapState({
      isCombatOverlayOpen: state => state.ui.isCombatOverlayOpen,
      party: state => state.party.characters,
      isInCombat: state => state.combat.isInCombat,
      enemies: state => state.combat.enemies,
      allies: state => state.combat.allies,
      grid: state => state.combat.grid,
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
    onDropOnCell(event, cell, newPosition) {
      const { unit, oldPosition } = JSON.parse(event.dataTransfer.getData('dragUnit'))
      this.moveUnit({ unit, oldPosition, newPosition })
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
.open-combat-overlay-button {
  position: fixed;
  bottom: 0.5rem;
  right: 0.5rem;
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
