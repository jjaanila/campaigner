<template>
  <h5 class="area-title">{{ name }}</h5>
</template>

<script>
export default {
  name: 'AreaTitle',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.area-title {
}
</style>
