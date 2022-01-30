<template>
  <span class="monster-section-header">{{ name }}</span>
</template>

<script>
export default {
  name: 'MonsterSectionHeader',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.monster-section-header {
  display: block;
  border-bottom: 1px solid #58180d;
  color: #58180d;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}
</style>
