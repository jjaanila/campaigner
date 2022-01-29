<template>
  <h6 class="sub-area-title">{{ name }}</h6>
</template>

<script>
export default {
  name: 'SubAreaTitle',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.sub-area-title {
}
</style>
