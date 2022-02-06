<template>
  <div class="party">
    <input type="text" v-model="characterLevels" v-on:input="updatePartyStore" placeholder="Character levels" />
  </div>
</template>

<script>
export default {
  name: 'Encounter',
  inject: ['partyStore'],
  data() {
    return {
      characterLevels: [],
    }
  },
  methods: {
    updatePartyStore() {
      this.partyStore.setCharacters(this.characterLevels.split(',').map(level => ({level: parseInt(level, 10)})))
    },
    }
  },
}
</script>

<style scoped>
.party {
}
</style>
