<template>
  <h2 :id="h2Id" class="part-title">{{ name }}</h2>
</template>

<script>
import { generateId } from '../utils'
export default {
  name: 'PartTitle',
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
    h2Id() {
      return this.id ?? generateId(this.name, 'part')
    },
  },
}
</script>

<style>
.part-title {
  text-align: center;
  counter-increment: h2counter;
  counter-reset: h3counter;
}
.part-title:before {
  content: 'Part ' counter(h2counter) ':\0000a0\0000a0';
}
.part-title.nocount:before {
  content: none;
  counter-increment: none;
}
</style>
