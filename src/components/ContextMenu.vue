<script setup>
import { nextTick, ref } from 'vue'
import { createPopper } from '@popperjs/core'
import Cog from '../img/cog.svg'
import IconButton from './IconButton.vue'

const popper = ref(null)
const button = ref(null)
const menu = ref(null)
const isOpen = ref(false)

const hide = () => {
  isOpen.value = false
  popper.value.destroy()
}

const toggle = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await nextTick()
    popper.value = createPopper(button.value.buttonRef, menu.value, {
      placement: 'bottom-start',
    })
  } else {
    hide()
  }
}
</script>

<template>
  <IconButton ref="button" class="context-menu-button" size="small" :icon-src="Cog" @click="toggle" />
  <teleport to="body">
    <div v-if="isOpen" ref="menu" v-click-away="hide" role="menu" class="context-menu"><slot /></div>
  </teleport>
</template>

<style scoped>
.context-menu {
  z-index: 9999;
}
</style>
