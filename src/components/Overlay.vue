<template>
  <TableOfContents v-if="tableOfContents" />
  <CombatOverlay />
  <Menu />
  <Party v-if="party" />
  <DiceOverlay v-if="dice" />
</template>

<script>
import DiceOverlay from './DiceOverlay.vue'
import Party from './Party.vue'
import TableOfContents from './TableOfContents.vue'
import CombatOverlay from './CombatOverlay.vue'
import Menu from './Menu.vue'
export default {
  name: 'Overlay',
  components: {
    CombatOverlay,
    DiceOverlay,
    Menu,
    Party,
    TableOfContents,
  },
  props: {
    tableOfContents: {
      type: Boolean,
      default: true,
    },
    party: {
      type: Boolean,
      default: true,
    },
    dice: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style scoped></style>
