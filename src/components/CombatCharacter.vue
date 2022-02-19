<template>
  <combat-unit
    class="combat-character"
    :creature="character"
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
    character: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
.combat-character {
  background-color: lightgreen;
}
</style>
