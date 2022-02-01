<template>
  <h5 :id="h5Id" class="area-title">{{ name }}</h5>
</template>

<script>
import { generateId } from '../utils'
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
      return this.id ?? generateId(this.name, 'area')
    },
  },
}
</script>

<style>
.area-title {
  font-size: 1rem;
  color: #65291d;
  border-bottom: 1px solid #c9ad6a;
  margin: 1rem 0 0.2rem 0;
  counter-reset: subareacounter;
  counter-increment: areacounter;
}
.area-title:before {
  content: counter(areacounter) '.\0000a0\0000a0';
}
.area-title.nocount:before {
  content: none;
  counter-increment: none;
}
</style>
