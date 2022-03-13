<template>
  <main
    :style="{
      background: `url(${backgroundImage})`,
    }"
  >
    <page>
      <slot />
    </page>
  </main>
</template>

<script>
import { mapState } from 'vuex'
import Page from './Page.vue'
export default {
  name: 'Campaign',
  components: {
    Page,
  },
  data() {
    return {
      backgroundImage: require('../img/paper.jpg'),
    }
  },
  computed: {
    ...mapState({
      isCombatOverlayOpen: state => state.ui.isCombatOverlayOpen,
    }),
  },
  watch: {
    isCombatOverlayOpen(isCombatOverlayOpen) {
      if (isCombatOverlayOpen) {
        document.documentElement.style.overflowY = 'hidden'
        return
      }
      document.documentElement.style.overflowY = 'auto'
    },
  },
}
</script>

<style>
html {
  width: 100%;
  height: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  -webkit-box-sizing: inherit;
  -moz-box-sizing: inherit;
  box-sizing: inherit;
}
body {
  width: 100%;
  height: 100%;
  margin: 0;
}
.page {
  counter-reset: partcounter;
}
address,
time {
  display: block;
  text-align: center;
}
main {
  font-family: 'Merriweather', sans-serif;
  position: absolute;
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
}
p {
  text-align: justify;
}
p + p {
  text-indent: 2em;
}
code,
pre {
  display: block;
  margin: 1rem 0;
}
button {
  font-size: 1rem;
}
</style>
