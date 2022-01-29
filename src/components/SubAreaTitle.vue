<template>
  <h6 class="sub-area-title">{{ name }}</h6>
</template>

<script>
export default {
  name: 'SubAreaTitle',
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
.sub-area-title {
}
</style>
