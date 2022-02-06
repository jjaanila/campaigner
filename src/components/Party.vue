<template>
  <div class="party">
    <div class="character" v-for="character in partyStore.state.characters">
      <button v-on:click="partyStore.removeCharacter(character.name)" title="Remove party member">-</button>
      <input class="character-name" type="text" v-model="character.name" placeholder="Name" />
      <input
        class="character-level"
        type="number"
        v-model.number="character.level"
        min="1"
        v-on.input="partyStore.updateEncounterLimits()"
      />
    </div>
    <button v-on:click="partyStore.addCharacter()" title="New party member">+</button>
  </div>
</template>

<script>
export default {
  name: 'Encounter',
  inject: ['partyStore'],
}
</script>

<style scoped>
.party {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-end;
}
.character-name {
  max-width: 10rem;
}
.character-level {
  max-width: 2.5rem;
}
</style>
