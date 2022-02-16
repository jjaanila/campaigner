<template>
  <div class="combat-ally" :title="monster.name">
    {{ monster.name[0] }}
  </div>
</template>

<script>
export default {
  name: 'CombatAlly',
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
.combat-ally {
  background-color: lightblue;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}
.combat-ally:hover {
  filter: brightness(90%);
  transition: all 0.2s ease;
  cursor: pointer;
}
</style>
