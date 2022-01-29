<template>
  <h3 class="chapter-title">{{ name }}</h3>
</template>

<script>
export default {
  name: 'ChapterTitle',
  props: {
    name: String,
    required: true,
  },
  data() {
    return {}
  },
}
</script>

<style>
.chapter-title:before {
  content: 'Chapter ' counter(h3counter) ':\0000a0\0000a0';
  counter-increment: h3counter;
}
.chapter-title.nocount:before {
  content: none;
  counter-increment: none;
}
</style>
