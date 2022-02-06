<template>
  <div v-on:click="closeToC()" :class="`page ${isToCOpen ? 'toc-open' : ''}`"><slot /></div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'Page',
  computed: {
    ...mapState('ui', ['isToCOpen']),
  },
  methods: {
    ...mapActions('ui', ['closeToC']),
  },
}
</script>

<style>
.page {
  width: 60%;
  margin: 0 8rem 4rem 200px;
}
.toc-open {
  margin-left: calc(250px + 2rem);
}
@media only screen and (max-width: 600px) {
  .page {
    width: calc(100% - 2rem);
    margin: 1rem;
  }
}
</style>
