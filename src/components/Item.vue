<template>
  <div :id="containerId" class="item">
    <span class="item-name">{{ name }}</span>
    <span class="item-properties">{{ properties }}</span>
    <p class="item-description">{{ description }}</p>
  </div>
</template>

<script>
import { generateId } from '../utils'
export default {
  name: 'Item',
  props: {
    name: {
      type: String,
      required: true,
    },
    properties: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    id: {
      type: String,
    },
  },
  computed: {
    containerId() {
      return this.id ?? generateId(this.name, 'item')
    },
  },
}
</script>

<style scoped>
.item {
  display: flex;
  flex-flow: column nowrap;
  margin: 1rem 0;
}
.item-name {
  font-size: 1.25rem;
  color: #58180d;
}
.item-properties {
  font-style: italic;
}
.item-description {
  margin: 0.25rem 0 1rem 0;
  text-indent: 0;
}
</style>
