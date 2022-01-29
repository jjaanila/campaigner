<template>
  <h6 :id="h6Id" class="sub-area-title">{{ name }}</h6>
</template>

<script>
export default {
  name: 'SubAreaTitle',
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
    h6Id() {
      if (this.id) {
        return this.id
      }
      return generateId(this.name, 'subarea')
    },
  },
}
</script>

<style scoped>
.sub-area-title {
}
</style>
