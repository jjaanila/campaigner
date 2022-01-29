<template>
  <h2 class="part-title">{{ name }}</h2>
</template>

<script>
export default {
  name: 'PartTitle',
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
