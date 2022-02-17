<template>
  <div class="combat-enemy" :title="monster.name" @dragstart="$emit('dragstart', $event)">
    {{ monster.name[0] }}
  </div>
</template>

<script>
export default {
  name: 'CombatEnemy',
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
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}
.combat-enemy:hover {
  filter: brightness(90%);
  transition: all 0.2s ease;
  cursor: pointer;
}
</style>
