<script setup>
import Cog from '../img/cog.svg'
import MenuItem from './MenuItem.vue'
</script>

<template>
  <MenuItem :icon="Cog" title="Settings">
    <h2 tabindex="0">Settings</h2>
    <div>
      <input id="hide-table-of-contents" type="checkbox" name="hide-table-of-contents" @click.stop />
      <label for="hide-table-of-contents">Hide table of contents</label>
    </div>
    <div>
      <input id="hide-party" type="checkbox" name="hide-party" @click.stop />
      <label for="hide-party">Hide party</label>
    </div>
    <div>
      <input id="hide-dice" type="checkbox" name="hide-dice" @click.stop />
      <label for="hide-dice">Hide dice</label>
    </div>
  </MenuItem>
</template>

<style scoped></style>
