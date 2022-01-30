<template>
  <a :class="aClass" :href="aHref">{{ name }}</a>
</template>

<script>
import { generateId } from '../utils'
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
    aHref() {
      return `#${this.id ?? generateId(this.name, this.type)}`
    },
    aClass() {
      return `id-link ${this.type}-id-link`
    }
  },
}
</script>

<style scoped>
.id-link {

}
</style>
