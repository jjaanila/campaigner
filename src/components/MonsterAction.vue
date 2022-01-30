<template>
  <div class="monster-action">
    <span class="monster-action-name">{{ name }}.</span>
    <span class="monster-action-descriptiom">{{ descriptiom }}</span>
  </div>
</template>

<script>
export default {
  name: 'MonsterAction',
  props: {
    name: {
      type: String,
      required: true,
    },
    descriptiom: {
      type: [String, Number],
      required: true,
    },
  },
}
</script>

<style scoped>
.monster-action {
  display: flex;
  flex-flow: row nowrap;
}
.monster-action-name {
  font-weight: bold;
}
.monster-action-descriptiom {
  margin-left: 0.25rem;
}
</style>
