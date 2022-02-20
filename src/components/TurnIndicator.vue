<template>
  <div class="turn-indicator" @click="$emit('click', $event)" />
</template>

<style scoped>
.turn-indicator {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  background-color: black;
  cursor: pointer;
  opacity: 0.25;
}
.turn-indicator.on {
  opacity: 1;
  cursor: unset;
}
.turn-indicator:not(.on):hover {
  opacity: 0.5;
}
</style>
