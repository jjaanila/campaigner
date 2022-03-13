<script setup>
defineProps({
  text: {
    type: String,
  },
})
</script>

<template>
  <div class="context-menu-item">
    <button v-if="text" class="context-menu-item-button">
      <span>{{ text }}</span>
    </button>
    <slot v-else />
  </div>
</template>

<style scoped>
.context-menu-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  background-color: #f2ead6;
}
.context-menu-item-button {
  min-width: 10rem;
  min-height: 2rem;
}
</style>
