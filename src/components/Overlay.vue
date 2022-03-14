<template>
  <table-of-contents v-if="tableOfContents" />
  <party v-if="party" />
  <dice-overlay v-if="dice" />
</template>

<script>
import DiceOverlay from './DiceOverlay.vue'
import Party from './Party.vue'
import TableOfContents from './TableOfContents.vue'
export default {
  name: 'Overlay',
  components: {
    DiceOverlay,
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
