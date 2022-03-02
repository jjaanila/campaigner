<template>
  <fragment>
    <table-of-contents v-if="tableOfContents" />
    <combat-overlay />
    <party v-if="party" />
    <dice-overlay v-if="dice" />
  </fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'
import DiceOverlay from './DiceOverlay.vue'
import Party from './Party.vue'
import TableOfContents from './TableOfContents.vue'
import CombatOverlay from './CombatOverlay.vue'
export default {
  name: 'Overlay',
  components: {
    Fragment,
    DiceOverlay,
    Party,
    TableOfContents,
    CombatOverlay,
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
