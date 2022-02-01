<template>
  <h6 :id="h6Id" class="sub-area-title">{{ name }}</h6>
</template>

<script>
import { generateId } from '../utils'
export default {
  name: 'SubAreaTitle',
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
    h6Id() {
      return this.id ?? generateId(this.name, 'subarea')
    },
  },
}
</script>

<style scoped>
h6 {
  font-size: 1.25srem;
}
</style>
