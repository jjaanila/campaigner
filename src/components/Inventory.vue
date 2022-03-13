<template>
  <div class="inventory">
    <IconButton
      :disabled="disabled"
      class="inventory-button"
      title="Inventory"
      size="small"
      :icon-src="backpackIcon"
      @click.stop="toggleInventory()"
    />
    <textarea
      v-show="isInventoryOpen"
      ref="inventory"
      v-click-away="hideInventory"
      :value="inventory"
      @input="updateInventory"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import BackpackIcon from '../img/backpack.svg'
import IconButton from './IconButton.vue'
export default {
  name: 'Inventory',
  components: {
    IconButton,
  },
  props: {
    character: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
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
      this.updateCharacterInventory({ characterId: this.character.id, inventory: e.target.value })
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
  height: 1.5rem;
  padding: 0 0.2rem 0 0.2rem;
}
</style>
