<template>
  <div class="monster-stat-row">
    <span class="monster-stat-row-label">{{ label }}</span>
    <span class="monster-stat-row-value">{{ value }}</span>
  </div>
</template>

<script>
export default {
  name: 'MonsterStatRow',
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
  },
}
</script>

<style scoped>
.monster-stat-row {
  display: flex;
  flex-flow: row nowrap;
}
.monster-stat-row-label {
  color: #65291d;
  font-weight: bold;
}
.monster-stat-row-value {
  margin-left: 0.25rem;
}
</style>
