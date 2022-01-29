<template>
  <h5 class="area-title">{{ name }}</h5>
</template>

<script>
export default {
  name: 'AreaTitle',
  props: {
    name: String,
    required: true,
  },
  data() {
    return {}
  },
}
</script>

<style scoped>
.area-title {
}
</style>
