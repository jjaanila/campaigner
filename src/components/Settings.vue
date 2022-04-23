<script setup>
import Cog from '../img/cog.svg'
import MenuItem from './MenuItem.vue'
import { useStore } from 'vuex'
const store = useStore()
</script>

<template>
  <MenuItem :icon="Cog" title="Settings">
    <h2 tabindex="0">Settings</h2>
    <div class="setting-checkbox">
      <input
        id="hide-table-of-contents"
        v-model="store.state.ui.hideToC"
        type="checkbox"
        name="hide-table-of-contents"
        @click.stop
      />
      <label for="hide-table-of-contents" class="setting-label">Hide table of contents</label>
    </div>
    <div class="setting-checkbox">
      <input
        id="hide-party"
        v-model="store.state.ui.hideParty"
        type="checkbox"
        name="hide-party"
        @click.stop
      />
      <label for="hide-party" class="setting-label">Hide party</label>
    </div>
    <div class="setting-checkbox">
      <input id="hide-dice" v-model="store.state.ui.hideDice" type="checkbox" name="hide-dice" @click.stop />
      <label for="hide-dice" class="setting-label">Hide dice</label>
    </div>
  </MenuItem>
</template>

<style scoped>
h2 {
  margin-top: 0;
}
.setting-checkbox {
  display: flex;
  align-items: center;
}
.setting-label {
  margin-left: 0.25rem;
}
</style>
