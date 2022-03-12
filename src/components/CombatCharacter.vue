<template>
  <combat-unit
    class="combat-character"
    :unit="unit"
    @dragstart="$emit('dragstart', $event)"
    @click="$emit('click', $event)"
    @drop="$emit('drop', $event)"
    @dragover.prevent
    @dragenter.prevent
  />
</template>

<script>
import CombatUnit from './CombatUnit.vue'
export default {
  name: 'CombatCharacter',
  components: {
    CombatUnit,
  },
  props: {
    unit: {
      type: Object,
      required: true,
    },
  },
  emits: ['dragstart', 'click', 'drop'],
}
</script>

<style scoped>
.combat-character {
  background-color: lightgreen;
}
</style>
