<template>
  <span :class="containerClass">
    <a :href="aHref">{{ name }}</a
    ><span v-if="!!monster" class="id-link-tooltip"><monster v-bind="monster" :id="null" /></span>
  </span>
</template>

<script>
import { generateId } from '../utils'
import { mapState } from 'vuex'
export default {
  name: 'IdLink',
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
    ...mapState('campaign', ['monsters']),
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
      return this.monsters.find(monster => monster.id === this.finalId)
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
