<template>
  <img class="monster-divider" :src="monsterLine" />
</template>

<script>
import monsterLine from '../img/monster_line.svg'
export default {
  name: 'MonsterDivider',
  data() {
    return {
      monsterLine,
    }
  },
}
</script>

<style>
.monster-divider {
  width: 100%;
  display: block;
  margin: 0.25rem 0;
}
</style>
