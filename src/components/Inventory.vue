<template>
  <div class="inventory">
    <button class="inventory-button" @click.stop="toggleInventory()" title="Inventory">
      <img :src="backpackIcon" />
    </button>
    <textarea
      v-click-outside="hideInventory"
      ref="inventory"
      v-show="isInventoryOpen"
      :value="inventory"
      @input="updateInventory"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { sortByKey } from '../utils'
import BackpackIcon from '../img/backpack.svg'
import ClickOutside from 'vue-click-outside'
export default {
  name: 'Inventory',
  props: {
    character: {
      type: Object,
      required: true,
    },
  },
  directives: {
    ClickOutside,
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
  mounted() {
    this.popupItem = this.$refs.inventory
  },
  methods: {
    ...mapActions('party', ['updateCharacterInventory']),
    toggleInventory() {
      this.isInventoryOpen = !this.isInventoryOpen
      if (this.isInventoryOpen) {
        this.$nextTick(() => {
          this.$refs.inventory.focus()
        })
      }
    },
    hideInventory() {
      this.isInventoryOpen = false
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
