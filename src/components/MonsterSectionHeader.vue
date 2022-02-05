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
  text-indent: 0;
  display: block;
  border-bottom: 1px solid #65291d;
  color: #65291d;
  font-size: 1rem;
  margin: 0.5rem 0 0.5rem 0;
}
</style>
