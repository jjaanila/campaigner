<template>
  <div v-if="label && value" class="monster-stat-row" tabindex="0">
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
  text-indent: 0;
  display: flex;
  flex-flow: row nowrap;
  color: #65291d;
}
.monster-stat-row-label {
  color: inherit;
  font-weight: bold;
}
.monster-stat-row-value {
  color: inherit;
  margin-left: 0.25rem;
}
</style>
