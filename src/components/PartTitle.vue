<template>
  <h2 class="part-title">{{ name }}</h2>
</template>

<script>
export default {
  name: 'PartTitle',
  props: {
    name: {
      type: String,
      required: true,
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
