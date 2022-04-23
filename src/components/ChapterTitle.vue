<template>
  <h3 :id="h3Id" class="chapter-title" tabindex="0">
    {{ name }}
  </h3>
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
.chapter-title {
  font-family: 'Cinzel', sans-serif;
  color: #58180d;
  font-size: 3rem;
  margin: 3rem 0 1rem 0;
  counter-increment: chaptercounter;
}
.chapter-title:before {
  content: 'Chapter ' counter(chaptercounter) ':\0000a0\0000a0';
}
.chapter-title.nocount:before {
  content: none;
  counter-increment: none;
}
</style>
