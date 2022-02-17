<template>
  <div
    class="combat-character"
    :title="character.name"
    @dragstart="$emit('dragstart', $event)"
    @click="$emit('click', $event)"
  >
    {{ character.name.slice(0, 2) }}
  </div>
</template>

<script>
export default {
  name: 'CombatCharacter',
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
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}
.combat-character:hover {
  filter: brightness(90%);
  transition: all 0.2s ease;
  cursor: pointer;
}
</style>
