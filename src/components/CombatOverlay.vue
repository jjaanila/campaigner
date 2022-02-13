<template>
  <div>
    <div v-if="isCombatOverlayOpen" class="combat-overlay">
      <div class="combat-overlay-mask" @click="setIsCombatOverlayOpen(false)" />
      <div class="combat-overlay-content-background">
        <div class="combat-overlay-content"></div>
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
export default {
  name: 'CombatOverlay',
  computed: {
    ...mapState({
      isCombatOverlayOpen: state => state.ui.isCombatOverlayOpen,
      party: state => state.party.characters,
      isInCombat: state => state.combat.isInCombat,
      enemies: state => state.combat.enemies,
      allies: state => state.combat.allies,
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
.combat-overlay-content-background {
  background: white;
  position: fixed;
  right: 5rem;
  top: 1rem;
  width: calc(100% - 10rem);
  height: calc(100% - 2rem);
}
.combat-overlay-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  background-color: rgba(#fff, 0.5);
  background-image: linear-gradient(transparent 1px, transparent 1px),
    linear-gradient(90deg, transparent 1px, transparent 1px),
    linear-gradient(rgba(150, 150, 150, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(150, 150, 150, 0.3) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-position: -1px -1px, -1px -1px, -1px -1px, -1px -1px;
  z-index: 2;
}
.open-combat-overlay-button {
  position: fixed;
  bottom: 0.5rem;
  right: 0.5rem;
}
</style>
