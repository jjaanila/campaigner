import Vue from 'vue'
import { encounterDifficulties } from '../tables'

export default {
  state: Vue.observable({
    characters: [],
    encounterLimits: {
      easy: 0,
      medium: 0,
      hard: 0,
      deadly: 0,
    },
  }),
  setCharacters(characters) {
    this.state.characters = characters
    this.updateEncounterLimits()
  },
  addCharacter() {
    this.setCharacters([...this.state.characters, { name: '', level: 1 }])
  },
  removeCharacter(name) {
    const characterIndex = this.state.characters.findIndex(character => character.name === name)
    if (characterIndex === -1) {
      throw new Error(`Character ${name} not found`)
    }
    const characters = [...this.state.characters]
    characters.splice(characterIndex, 1)
    this.setCharacters(characters)
  },
  updateEncounterLimits() {
    this.state.encounterLimits = this.state.characters.reduce(
      (limits, character) => {
        const characterLimits = encounterDifficulties.find(ed => ed.characterLevel === character.level)
        if (!characterLimits) {
          throw new Error('Did not find character limits for character level ' + character.level)
        }
        limits.easy += characterLimits.easy
        limits.medium += characterLimits.medium
        limits.hard += characterLimits.hard
        limits.deadly += characterLimits.deadly
        return limits
      },
      { easy: 0, medium: 0, hard: 0, deadly: 0 }
    )
  },
}
