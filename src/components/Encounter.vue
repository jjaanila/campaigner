<template>
  <div class="encounter">
    <span v-for="enemy in enemiesWithMonsters" :key="enemy.id">
      {{ enemy.quantity }} <id-link :id="enemy.id" :name="enemy.monster.name" type="monster" />
    </span>
    <div v-if="alliesWithMonsters.length">
      <strong>Allies</strong>
      <span v-for="ally in alliesWithMonsters" :key="ally.id"
        >{{ ally.quantity }} <id-link :id="ally.id" :name="ally.monster.name" type="monster"
      /></span>
    </div>
    <span>
      {{ totalEnemyXP }} XP (á {{ XPPerCharacter }} XP)
      <span :class="difficultyClass">{{ difficulty }}</span> ({{ adjustedTotalEnemyXP }}
      XP)
    </span>
    <button @click="startCombat">Start</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Encounter',
  props: {
    enemies: {
      type: Array,
      required: true,
    },
    allies: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState({
      monsters: state => state.campaign.monsters,
      characters: state => state.party.characters,
      encounterLimits: state => state.party.encounterLimits,
      isCombatOverlayOpen: state => state.ui.isCombatOverlayOpen,
      isInCombat: state => state.combat.isInCombat,
    }),
    enemiesWithMonsters() {
      return [...this.enemies].map(enemy => {
        const monster = this.monsters.find(monster => monster.name === enemy.name)
        if (!monster) {
          throw new Error(`Monster ${enemy.name} not found!`)
        }
        return {
          ...enemy,
          monster,
        }
      })
    },
    alliesWithMonsters() {
      return [...this.allies].map(ally => {
        const monster = this.monsters.find(monster => monster.name === ally.name)
        if (!monster) {
          throw new Error(`Monster ${ally.name} not found!`)
        }
        return {
          ...ally,
          monster,
        }
      })
    },
    totalEnemyXP() {
      return this.enemiesWithMonsters.reduce((total, enemy) => total + enemy.quantity * enemy.monster.xp, 0)
    },
    XPPerCharacter() {
      return Math.floor(this.totalEnemyXP / this.characters.length)
    },

    numberOfEnemies() {
      return this.enemiesWithMonsters.reduce((total, enemy) => total + enemy.quantity, 0)
    },
    adjustedTotalEnemyXP() {
      let multiplier = 1
      if (this.numberOfEnemies === 2) {
        multiplier = 1.5
      } else if (3 <= this.numberOfEnemies && this.numberOfEnemies <= 6) {
        multiplier = 2
      } else if (7 <= this.numberOfEnemies && this.numberOfEnemies <= 10) {
        multiplier = 2.5
      } else if (11 <= this.numberOfEnemies && this.numberOfEnemies <= 14) {
        multiplier = 3
      } else if (15 <= this.numberOfEnemies) {
        multiplier = 3
      }
      return this.totalEnemyXP * multiplier
    },
    difficulty() {
      if (this.encounterLimits.easy === 0) {
        return ''
      }
      const partyLimits = [
        { xp: this.encounterLimits.deadly, difficulty: 'deadly' },
        { xp: this.encounterLimits.hard, difficulty: 'hard' },
        { xp: this.encounterLimits.medium, difficulty: 'medium' },
        { xp: this.encounterLimits.easy, difficulty: 'easy' },
      ]
      for (let limit of partyLimits) {
        if (this.adjustedTotalEnemyXP >= limit.xp) {
          return limit.difficulty
        }
      }
      return 'trivial'
    },
    difficultyClass() {
      return `difficulty difficulty-${this.difficulty}`
    },
  },
  methods: {
    ...mapActions('combat', ['initializeCombat', 'setIsInCombat']),
    ...mapActions('ui', ['setIsCombatOverlayOpen']),
    startCombat() {
      if (this.isInCombat && !confirm('The party is already in combat. Do you want to start a new one?')) {
        return
      }
      this.initializeCombat({
        enemies: this.enemies,
        allies: this.allies,
      })
      this.setIsInCombat(true)
      this.setIsCombatOverlayOpen(true)
    },
  },
}
</script>

<style scoped>
.encounter {
  margin: 0.5rem 0;
}
.difficulty {
  font-weight: bold;
}
.difficulty-easy {
  color: lightgreen;
}
.difficulty-medium {
  color: darkgreen;
}
.difficulty-hard {
  color: darkorange;
}
.difficulty-deadly {
  color: red;
}
</style>
