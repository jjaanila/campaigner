<template>
  <div class="encounter">
    <span v-for="enemy in richEnemies"
      >{{ enemy.quantity }} <id-link :id="enemy.id" :name="enemy.monster.name" type="monster"
    /></span>
    <strong v-if="richAllies.length">Allies</strong>
    <span v-for="ally in richAllies">{{ ally.quantity }} <id-link :id="ally.id" :name="ally.name" /></span>
    <span>
      {{ totalEnemyXP }} XP (á {{ XPPerCharacter }} XP) <span :class="difficultyClass">{{ difficulty }}</span> ({{
        adjustedTotalEnemyXP
      }}
      XP)
    </span>
  </div>
</template>

<script>
export default {
  name: 'Encounter',
  inject: ['campaignStore', 'partyStore'],
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
    richEnemies() {
      return [...this.enemies].map(enemy => {
        const monster = this.campaignStore.state.monsters.find(monster => monster.name === enemy.name)
        if (!monster) {
          throw new Error(`Monster ${enemy.name} not found!`)
        }
        return {
          ...enemy,
          monster,
        }
      })
    },
    richAllies() {
      return [...this.allies]
    },
    totalEnemyXP() {
      return this.richEnemies.reduce((total, enemy) => total + enemy.quantity * enemy.monster.xp, 0)
    },
    XPPerCharacter() {
      return Math.floor(this.totalEnemyXP / this.partyStore.state.characters.length)
    },

    numberOfEnemies() {
      return this.richEnemies.reduce((total, enemy) => total + enemy.quantity, 0)
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
      if (this.partyStore.state.encounterLimits.easy === 0) {
        return ''
      }
      const partyLimits = [
        { xp: this.partyStore.state.encounterLimits.deadly, difficulty: 'deadly' },
        { xp: this.partyStore.state.encounterLimits.hard, difficulty: 'hard' },
        { xp: this.partyStore.state.encounterLimits.medium, difficulty: 'medium' },
        { xp: this.partyStore.state.encounterLimits.easy, difficulty: 'easy' },
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
