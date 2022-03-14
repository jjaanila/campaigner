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
          <combat-grid />
        </div>
      </div>
    </div>
    <IconButton
      v-if="isInCombat"
      :icon-src="crossedSwordsSvg"
      size="large"
      title="Combat"
      class="combat-overlay-open-button"
      @click="setIsCombatOverlayOpen(true)"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import CombatTurnOrder from './CombatTurnOrder.vue'
import CombatUnitDetailsList from './CombatUnitDetailsList.vue'
import CombatGrid from './CombatGrid.vue'
import IconButton from './IconButton.vue'
export default {
  name: 'CombatOverlay',
  components: {
    CombatTurnOrder,
    CombatUnitDetailsList,
    CombatGrid,
    IconButton,
  },
  data() {
    return {
      backgroundImage: require('../img/paper.jpg'),
      crossedSwordsSvg: require('../img/crossed-swords.svg'),
    }
  },
  computed: {
    ...mapState({
      isCombatOverlayOpen: state => state.ui.isCombatOverlayOpen,
      isInCombat: state => state.combat.isInCombat,
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
</style>
