<template>
  <h4 class="section-title">{{ name }}</h4>
</template>

<script>
export default {
  name: 'SectionTitle',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
}
</script>

<style></style>
