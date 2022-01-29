<template>
  <h3 class="chapter-title">Chapter X: {{ name }}</h3>
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

<style></style>
