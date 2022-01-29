<template>
  <h5 :id="h5Id" class="area-title">{{ name }}</h5>
</template>

<script>
export default {
  name: 'AreaTitle',
  props: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
    },
  },
  computed: {
    h5Id() {
      if (this.id) {
        return this.id
      }
      return generateId(this.name, 'area')
    },
  },
}
</script>

<style scoped>
.area-title {
}
</style>
