<template>
  <div class="party">
    <div class="character" v-for="character in characters">
      <button v-on:click="removeCharacter(character.name)" title="Remove party member">-</button>
      <input class="character-name" type="text" v-model="character.name" placeholder="Name" />
      <input
        class="character-level"
        type="number"
        v-on:input="updateCharacters()"
        v-model.number="character.level"
        min="1"
        max="20"
        value="1"
        placeholder="lvl"
      />
    </div>
    <button v-on:click="addCharacter()" title="New party member">+</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Party',
  computed: {
    ...mapState({
      characters: state => state.party.characters,
    }),
  },
  methods: {
    ...mapActions('party', ['addCharacter', 'removeCharacter', 'updateCharacters']),
  },
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
