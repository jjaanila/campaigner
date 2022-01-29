<template>
  <h4 class="section-title">{{ name }}</h4>
</template>

<script>
export default {
  name: 'SectionTitle',
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
