<template>
  <h3 :id="h3Id" class="chapter-title">{{ name }}</h3>
</template>

<script>
import { generateId } from '../utils'
export default {
  name: 'ChapterTitle',
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
    h3Id() {
      return this.id ?? generateId(this.name, 'chapter')
    },
  },
}
</script>

<style scoped>
.chapter-title:before {
  content: 'Chapter ' counter(h3counter) ':\0000a0\0000a0';
  counter-increment: h3counter;
}
.chapter-title.nocount:before {
  content: none;
  counter-increment: none;
}
</style>
