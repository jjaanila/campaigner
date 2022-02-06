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
