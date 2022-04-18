<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Synchronization from './Synchronization.vue'
import Notebook from './Notebook.vue'
import Settings from './Settings.vue'
import IconButton from './IconButton.vue'
import crossedSwordsSvg from '../img/crossed-swords.svg'

const store = useStore()

const isInCombat = computed(() => store.state.combat.isInCombat)
const isCombatOverlayOpen = computed(() => store.state.ui.isCombatOverlayOpen)

const setIsCombatOverlayOpen = value => {
  store.dispatch('ui/setIsCombatOverlayOpen', value)
}
</script>

<template>
  <nav class="menu">
    <Synchronization />
    <Notebook />
    <IconButton
      v-if="isInCombat"
      :icon-src="crossedSwordsSvg"
      size="large"
      title="Combat"
      class="combat-overlay-open-button"
      @click="setIsCombatOverlayOpen(!isCombatOverlayOpen)"
    />
    <Settings />
  </nav>
</template>

<style scoped>
.menu {
  position: fixed;
  left: 50%;
  top: 0;
  transform: translatex(-50%);
  display: flex;
  flex-flow: row;
  align-items: flex-end;
}
</style>
