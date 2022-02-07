<template>
  <div class="party">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>AC</th>
          <th>HP</th>
          <th>MHP</th>
          <th>Lvl</th>
          <th>Wis</th>
          <th>Spd</th>
        </tr>
      </thead>
      <tbody>
        <tr class="character" v-for="character in characters">
          <td>
            <input class="character-name" type="text" v-model="character.name" placeholder="Name" />
          </td>
          <td>
            <input
              class="character-armor-class"
              type="number"
              v-on:input="updateCharacters()"
              v-model.number="character.armorClass"
              min="1"
              max="30"
              value="1"
            />
          </td>
          <td>
            <input
              class="character-hit-points"
              type="number"
              v-on:input="updateCharacters()"
              v-model.number="character.hitPoints"
              min="0"
              :max="character.maxHitPoints"
              value="1"
            />
          </td>
          <td>
            <input
              class="character-max-hit-points"
              type="number"
              v-on:input="updateCharacters()"
              v-model.number="character.maxHitPoints"
              :size="character.maxHitPoints && character.maxHitPoints.toString().length"
              min="1"
              value="1"
            />
          </td>
          <td>
            <input
              class="character-level"
              type="number"
              v-on:input="updateCharacters()"
              v-model.number="character.level"
              min="1"
              max="20"
              value="1"
            />
          </td>
          <td>
            <input
              class="character-passive-wisdom"
              type="number"
              v-on:input="updateCharacters()"
              v-model.number="character.passiveWisdom"
              min="1"
              max="30"
              value="1"
            />
          </td>
          <td>
            <input
              class="character-speed"
              type="number"
              v-on:input="updateCharacters()"
              v-model.number="character.speed"
              min="0"
              max="100"
              value="30"
            />
          </td>
        </tr>
      </tbody>
    </table>
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
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
.party {
  position: fixed;
  top: 1rem;
  right: 1rem;
  font-size: 0.75rem;
}
.party > table {
  border-spacing: 0;
}
.character {
}
.character-hit-points,
.character-max-hit-points,
.character-level,
.character-armor-class {
  width: 2rem;
}
.character-name {
  max-width: 5rem;
}
</style>
