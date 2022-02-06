<template>
  <span :class="containerClass">
    <a :href="aHref">{{ name }}</a>
    <span v-if="!!monster" class="id-link-tooltip"> <monster id="" v-bind="monster" /> </span>
  </span>
</template>

<script>
import { generateId } from '../utils'
export default {
  name: 'IdLink',
  inject: ['campaignStore'],
  props: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    id: {
      type: String,
    },
  },
  computed: {
    finalId() {
      return this.id ?? generateId(this.name, this.type)
    },
    aHref() {
      return `#${this.finalId}`
    },
    containerClass() {
      return `id-link ${this.type}-id-link`
    },
    monster() {
      if (this.type !== 'monster') {
        return
      }
      return this.campaignStore.state.monsters.find(monster => monster.id === this.finalId)
    },
  },
}
</script>

<style scoped>
.id-link > a {
  color: #65291d;
}
.id-link-tooltip {
  display: none;
  z-index: 1;
}
.id-link:hover .id-link-tooltip {
  display: inline-block;
}
</style>
