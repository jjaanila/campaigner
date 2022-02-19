<template>
  <combat-unit
    class="combat-enemy"
    :creature="monster"
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
    monster: {
      type: Object,
      required: true,
    },
  },
  computed: {},
}
</script>

<style scoped>
.combat-enemy {
  background-color: pink;
}
</style>
