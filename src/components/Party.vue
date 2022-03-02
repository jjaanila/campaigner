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
            <condition-menu :creature="character" />
            <inventory :character="character" />
          </td>
          <td>
            <input v-model="character.name" class="character-name" type="text" placeholder="Name" />
          </td>
          <td>
            <input
              v-model.number="character.armorClass"
              class="stat-input character-armor-class"
              type="number"
              min="1"
              max="30"
              value="1"
              @input="updateCharacters()"
            />
          </td>
          <td>
            <input
              v-model.number="character.hitPoints"
              class="stat-input character-hit-points"
              type="number"
              min="0"
              :max="character.maxHitPoints"
              value="1"
              @input="updateCharacters()"
            />
          </td>
          <td>
            <input
              v-model.number="character.maxHitPoints"
              class="stat-input character-max-hit-points"
              type="number"
              :size="character.maxHitPoints && character.maxHitPoints.toString().length"
              min="1"
              value="1"
              @input="updateCharacters()"
            />
          </td>
          <td>
            <input
              v-model.number="character.level"
              class="stat-input character-level"
              type="number"
              min="1"
              max="20"
              value="1"
              @input="updateCharacters()"
            />
          </td>
          <td>
            <input
              v-model.number="character.passiveWisdom"
              class="stat-input character-passive-wisdom"
              type="number"
              min="1"
              max="30"
              value="1"
              @input="updateCharacters()"
            />
          </td>
          <td>
            <input
              v-model.number="character.speed"
              class="stat-input character-speed"
              type="number"
              min="0"
              max="100"
              value="30"
              @input="updateCharacters()"
            />
          </td>
          <td>
            <button title="Remove party member" @click="removeCharacter(character.id)">-</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button title="Add party member" @click="addCharacter()">+</button>
    <button title="Download current Campaigner state" @click.prevent="downloadState()">Download state</button>
    <button title="Load Campaigner state from disk" @click.prevent="openStateFileSelection()">
      Upload state
    </button>
    <input
      ref="stateFileInput"
      accept="application/json"
      type="file"
      name="state-file"
      style="display: none"
      @change="uploadState"
    />
    <notebook />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ConditionMenu from './ConditionMenu.vue'
import Inventory from './Inventory.vue'
import Notebook from './Notebook.vue'
export default {
  name: 'Party',
  components: {
    ConditionMenu,
    Inventory,
    Notebook,
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
    ]),
    openStateFileSelection() {
      this.$refs.stateFileInput.click()
    },
    downloadState() {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(
        new Blob([JSON.stringify({ party: this.party, combat: this.combat })], {
          type: 'text/plain',
        })
      )
      link.download = `campaigner-state-${new Date().toISOString()}.json`
      link.click()
      URL.revokeObjectURL(link.href)
    },
    uploadState(e) {
      e.target.files[0].text().then(stateText => {
        try {
          const state = JSON.parse(stateText)
          if (confirm('This will overwrite your current Campaigner state. Are you sure?')) {
            this.$store.replaceState({
              ...this.$store.state,
              ...state,
            })
          }
        } catch (err) {
          console.error(err)
          alert('Invalid state file')
          return
        }
      })
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
