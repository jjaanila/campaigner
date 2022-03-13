<template>
  <div class="party">
    <table v-show="characters.length">
      <thead>
        <tr>
          <th />
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
        <tr v-for="character in characters" :key="character.id" class="character">
          <td class="condition-menu-td">
            <condition-menu :creature="character" :disabled="character.disabled" />
            <inventory :character="character" :disabled="character.disabled" />
          </td>
          <td>
            <input
              v-model="character.name"
              :disabled="character.disabled"
              class="character-name"
              type="text"
              placeholder="Name"
            />
          </td>
          <td>
            <input
              v-model.number="character.armorClass"
              :disabled="character.disabled"
              class="stat-input character-armor-class"
              type="number"
              min="1"
              max="30"
              @input="updateCharacters()"
            />
          </td>
          <td>
            <input
              v-model.number="character.hitPoints"
              :disabled="character.disabled"
              class="stat-input character-hit-points"
              type="number"
              min="0"
              :max="character.maxHitPoints"
              @input="updateCharacters()"
            />
          </td>
          <td>
            <input
              v-model.number="character.maxHitPoints"
              :disabled="character.disabled"
              class="stat-input character-max-hit-points"
              type="number"
              :size="character.maxHitPoints && character.maxHitPoints.toString().length"
              min="1"
              @input="updateCharacters()"
            />
          </td>
          <td>
            <input
              v-model.number="character.level"
              :disabled="character.disabled"
              class="stat-input character-level"
              type="number"
              min="1"
              max="20"
              @input="updateCharacters()"
            />
          </td>
          <td>
            <input
              v-model.number="character.passiveWisdom"
              :disabled="character.disabled"
              class="stat-input character-passive-wisdom"
              type="number"
              min="1"
              max="30"
              @input="updateCharacters()"
            />
          </td>
          <td>
            <input
              v-model.number="character.speed"
              :disabled="character.disabled"
              class="stat-input character-speed"
              type="number"
              min="0"
              max="100"
              @input="updateCharacters()"
            />
          </td>
          <td>
            <ContextMenu>
              <ContextMenuItem
                :text="character.disabled ? 'Enable' : 'Disable'"
                @click="toggleDisabilityOfCharacter(character.id)"
              />
              <ContextMenuItem text="Delete" @click="removeCharacter(character.id)" />
            </ContextMenu>
          </td>
        </tr>
      </tbody>
    </table>
    <button title="Add party member" @click="addCharacter()">+</button>
    <synchronization />
    <notebook />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ConditionMenu from './ConditionMenu.vue'
import Inventory from './Inventory.vue'
import Notebook from './Notebook.vue'
import Synchronization from '../components/Synchronization.vue'
import ContextMenu from '../components/ContextMenu.vue'
import ContextMenuItem from '../components/ContextMenuItem.vue'
export default {
  name: 'Party',
  components: {
    ConditionMenu,
    ContextMenu,
    ContextMenuItem,
    Inventory,
    Notebook,
    Synchronization,
  },
  computed: {
    ...mapState({
      characters: state => state.party.characters,
      party: state => state.party,
      combat: state => state.combat,
    }),
  },
  methods: {
    ...mapActions('party', [
      'addCharacter',
      'removeCharacter',
      'updateCharacters',
      'addCondition',
      'removeCondition',
      'enableCharacter',
      'disableCharacter',
    ]),
    toggleDisabilityOfCharacter(characterId) {
      const character = this.characters.find(character => character.id === characterId)
      if (character.disabled) {
        this.enableCharacter(character.id)
      } else {
        this.disableCharacter(character.id)
      }
    },
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
  z-index: 3;
  position: fixed;
  top: 1rem;
  right: 1rem;
  font-size: 0.75rem;
  display: flex;
  flex-flow: column wrap;
  align-items: flex-end;
}
.party > * {
  pointer-events: auto;
}
.party > table {
  border-spacing: 0;
}
.stat-input {
  width: 2rem;
}
.condition-menu-td {
  display: flex;
  justify-content: flex-end;
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
