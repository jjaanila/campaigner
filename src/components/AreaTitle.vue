<template>
  <h5 :id="h5Id" class="area-title">{{ name }}</h5>
</template>

<script>
import { generateId } from '../utils'
export default {
  name: 'AreaTitle',
  props: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
    },
  },
  computed: {
    h5Id() {
      return this.id ?? generateId(this.name, 'area')
    },
  },
}
</script>

<style scoped>
h5 {
  font-size: 0.75rem;
}
</style>
