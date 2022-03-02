<template>
  <combat-unit
    class="combat-ally"
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
  name: 'CombatAlly',
  components: {
    CombatUnit,
  },
  props: {
    unit: {
      type: Object,
      required: true,
    },
  },
  computed: {},
}
</script>

<style scoped>
.combat-ally {
  background-color: lightblue;
}
</style>
