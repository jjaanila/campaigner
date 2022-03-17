<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Synchronization from './Synchronization.vue'
import Notebook from './Notebook.vue'
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
  <div class="menu">
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
  </div>
</template>

<style scoped>
.menu {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translatey(-50%);
  display: flex;
  flex-flow: column;
  align-items: flex-end;
}
</style>
