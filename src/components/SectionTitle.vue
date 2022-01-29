<template>
  <h4 :id="h4Id" class="section-title">{{ name }}</h4>
</template>

<script>
import { generateId } from './utils'
export default {
  name: 'SectionTitle',
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
    h4Id() {
      if (this.id) {
        return this.id
      }
      return generateId(this.name, 'section')
    },
  },
}
</script>

<style></style>
