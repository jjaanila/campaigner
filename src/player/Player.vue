<template>
  <main
    :style="{
      background: `url(${backgroundImage})`,
    }"
  >
    <combat-turn-order class="combat-turn-order" />
    <combat-grid />
  </main>
</template>

<script>
import 'normalize.css'
import CombatGrid from '../components/CombatGrid.vue'
import CombatTurnOrder from '../components/CombatTurnOrder.vue'
import { LOCAL_STORAGE_STATE_KEY as COMBAT_LOCAL_STORAGE_KEY } from '../stores/combat.store'
import { LOCAL_STORAGE_STATE_KEY as PARTY_LOCAL_STORAGE_KEY } from '../stores/party.store'
export default {
  name: 'PlayerCombat',
  components: {
    CombatGrid,
    CombatTurnOrder,
  },
  data() {
    return {
      backgroundImage: require('../img/paper.jpg'),
    }
  },
  mounted() {
    window.addEventListener('storage', this.onStorageChange)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.onStorageChange)
  },
  methods: {
    onStorageChange(event) {
      if (event.storageArea != localStorage) return
      if (event.key === PARTY_LOCAL_STORAGE_KEY) {
        this.$store.replaceState({
          ...this.$store.state,
          party: JSON.parse(event.newValue),
        })
      }
      if (event.key === COMBAT_LOCAL_STORAGE_KEY) {
        this.$store.replaceState({
          ...this.$store.state,
          combat: JSON.parse(event.newValue),
        })
      }
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
#app {
  height: 100%;
  width: 100%;
}
body {
  width: 100%;
  height: 100%;
  margin: 0;
}
main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
.combat-turn-order {
  margin-bottom: 1rem;
}
</style>
