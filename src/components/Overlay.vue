<script setup>
import DiceOverlay from './DiceOverlay.vue'
import Party from './Party.vue'
import TableOfContents from './TableOfContents.vue'
import CombatOverlay from './CombatOverlay.vue'
import Menu from './Menu.vue'
import { useStore } from 'vuex'
const store = useStore()
</script>

<template>
  <TableOfContents v-if="!store.state.ui.hideToC" />
  <CombatOverlay />
  <Menu />
  <Party v-if="!store.state.ui.hideParty" />
  <DiceOverlay v-if="!store.state.ui.hideDice" />
</template>

<style scoped></style>
