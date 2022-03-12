<template>
  <combat-unit
    class="combat-enemy"
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
  name: 'CombatEnemy',
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
  computed: {},
}
</script>

<style scoped>
.combat-enemy {
  background-color: pink;
}
</style>
