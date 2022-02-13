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
          <tr v-for="(row, i) in grid" :key="i">
            <td v-for="(cell, j) in row" :key="j">
              <combat-enemy v-if="cell.units.length" :monster="cell.units[0]" />
              <div v-else class="combat-empty-cell" />
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
import CombatEnemy from './CombatEnemy.vue'
export default {
  name: 'CombatOverlay',
  components: {
    CombatEnemy,
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
