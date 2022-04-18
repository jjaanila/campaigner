<script setup>
import { nextTick, ref } from 'vue'
import { createPopper } from '@popperjs/core'
import IconButton from './IconButton.vue'

const popper = ref(null)
const button = ref(null)
const menuItem = ref(null)
const isOpen = ref(false)

const props = defineProps({
  icon: {
    type: String,
  },
  title: {
    type: String,
  },
})

const hide = () => {
  isOpen.value = false
  popper.value.destroy()
}

const toggle = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await nextTick()
    popper.value = createPopper(button.value.buttonRef, menuItem.value, {
      placement: 'bottom-start',
    })
  } else {
    hide()
  }
}
</script>

<template>
  <IconButton
    ref="button"
    :title="props.title"
    class="menu-item-button"
    size="large"
    :icon-src="props.icon"
    @click="toggle"
  />
  <Teleport to="body">
    <div v-if="isOpen" ref="menuItem" v-click-away="hide" role="menu" class="menu-item-content" @click="hide">
      <slot />
    </div>
  </Teleport>
</template>

<style scoped>
.menu-item-content {
  z-index: 9999;
  background-color: #f2ead6;
  padding: 1rem;
  border-radius: 10px;
  border-top-left-radius: 0;
  border: 1px solid #c9ad6a;
  box-shadow: 0.1rem 0.2rem 0.2rem rgba(0, 0, 0, 0.3);
}
</style>
