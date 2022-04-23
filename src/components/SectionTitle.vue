<template>
  <component :is="headingTag" :id="headingId" class="section-title" tabindex="0">
    {{ name }}
  </component>
</template>

<script>
import { generateId } from '../utils'
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
    headingTag: {
      type: String,
      default: 'h4',
    },
  },
  computed: {
    headingId() {
      return this.id ?? generateId(this.name, 'section')
    },
  },
}
</script>

<style>
.section-title {
  font-family: 'Cinzel', sans-serif;
  font-size: 2rem;
  color: #65291d;
  margin: 4rem 0 0.5rem 0;
}
</style>
