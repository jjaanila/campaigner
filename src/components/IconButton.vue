<script setup>
import { defineProps } from 'vue'
defineProps({
  size: {
    type: String,
    required: true,
    validator(value) {
      return ['small', 'large'].includes(value)
    },
  },
  iconSrc: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <button :class="{ 'icon-button': true, large: size === 'large', small: size === 'small' }">
    <img :src="iconSrc" />
  </button>
</template>

<style scoped>
.icon-button {
  display: flex;
  justify-content: center;
  align-items: center;
}
.small {
  width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.2rem 0 0.2rem;
}
.large {
  width: 3rem;
  height: 3rem;
  padding: 0 0.2rem 0 0.2rem;
}
</style>
