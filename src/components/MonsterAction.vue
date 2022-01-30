<template>
  <div class="monster-action">
    <span class="monster-action-description"><span class="monster-action-name">{{ name }}.</span>{{ descriptiom }}</span>
  </div>
</template>

<script>
import Dice from '../Dice'
export default {
  name: 'MonsterAction',
  props: {
    name: {
      type: String,
      required: true,
    },
    descriptiom: {
      type: [String, Number],
    },
    type: {
      type: String,
    },
    toHit: {
      type: Number,
    },
    reachFt: {
      type: Number,
    },
    damageType: {
      type: String,
    },
    damage: {
      type: [Number, Dice],
    }
  },
  computed: {

  }
}
</script>

<style scoped>
.monster-action {
  display: flex;
  flex-flow: row nowrap;
}
.monster-action-name {
  font-weight: bold;
  font-style: italic;
  white-space: nowrap;
  margin-right: 0.25rem;
}
.monster-action-description {
}
</style>
