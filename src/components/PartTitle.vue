<template>
  <h2 :id="h2Id" class="part-title"><br /><br />{{ name }}</h2>
</template>

<script>
import { generateId } from '../utils'
export default {
  name: 'PartTitle',
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
    h2Id() {
      return this.id ?? generateId(this.name, 'part')
    },
  },
}
</script>

<style scoped>
.part-title {
  font-family: 'Cinzel', sans-serif;
  text-align: center;
  color: #58180d;
  font-size: 2rem;
  margin: 10rem 0 10rem 0;
  counter-increment: h2counter;
  counter-reset: h3counter;
}
.part-title:before {
  content: 'Part ' counter(h2counter);
}
.part-title.nocount:before {
  content: none;
  counter-increment: none;
}
</style>
