<script setup>
import { ref } from 'vue'
import InlineSvg from 'vue-inline-svg'
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
  disabled: {
    type: Boolean,
    default: false,
  },
})
const buttonRef = ref(null)
defineExpose({
  buttonRef,
})
</script>

<template>
  <button
    ref="buttonRef"
    :disabled="disabled"
    :class="{ 'icon-button': true, large: size === 'large', small: size === 'small', disabled: disabled }"
  >
    <InlineSvg class="icon" :src="iconSrc" />
  </button>
</template>

<style scoped>
.icon-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.disabled {
  fill: gray;
}
.icon {
  width: 80%;
  height: 80%;
}
.small {
  width: 1.5rem;
  height: 1.5rem;
}
.large {
  width: 3rem;
  height: 3rem;
}
</style>
