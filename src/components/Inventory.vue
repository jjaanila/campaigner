<template>
  <div class="inventory">
    <button class="inventory-button" @click.stop="toggleInventory()" title="Inventory">
      <img :src="backpackIcon" />
    </button>
    <textarea v-if="isInventoryOpen" :value="inventory" @input="updateInventory" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { sortByKey } from '../utils'
import BackpackIcon from '../img/backpack.svg'
export default {
  name: 'Inventory',
  props: {
    character: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isInventoryOpen: false,
      backpackIcon: BackpackIcon,
    }
  },
  computed: {
    ...mapState({
      inventory(state) {
        return state.party.characters.find(c => c.name === this.character.name).inventory
      },
    }),
  },
  methods: {
    ...mapActions('party', ['updateCharacterInventory']),
    toggleInventory() {
      this.isInventoryOpen = !this.isInventoryOpen
    },
    updateInventory(e) {
      this.updateCharacterInventory({ characterName: this.character.name, inventory: e.target.value })
    },
  },
}
</script>

<style>
.inventory {
  position: relative;
}
.inventory > textarea {
  z-index: 1000;
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 20rem;
  height: 30rem;
}
.inventory-button {
  width: 1.5rem;
  padding: 0 0.2rem 0 0.2rem;
}
</style>
