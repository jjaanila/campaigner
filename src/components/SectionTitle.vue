<template>
  <h4 :id="h4Id" class="section-title" tabindex="0">
    {{ name }}
  </h4>
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
  },
  computed: {
    h4Id() {
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
