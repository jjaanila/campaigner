<template>
  <h6 :id="h6Id" class="sub-area-title">
    {{ name }}
  </h6>
</template>

<script>
import { generateId } from '../utils'
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
      return this.id ?? generateId(this.name, 'subarea')
    },
  },
}
</script>

<style>
.sub-area-title {
  font-family: 'Cinzel', sans-serif;
  font-size: 0.85rem;
  color: #65291d;
  margin: 1rem 0 0.1rem 0;
  counter-increment: subareacounter;
}
.sub-area-title:before {
  content: counter(areacounter) '.' counter(subareacounter) '\0000a0\0000a0';
}
.sub-area-title.nocount:before {
  content: none;
  counter-increment: none;
}
</style>
