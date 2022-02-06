<template>
  <div class="encounter">
    <strong>Encounter:</strong>
    <span v-for="enemy in enemies">{{ enemy.quantity }} <id-link :id="enemy.id" :name="enemy.monster.name" /></span>
    <strong v-if="allies.length">Allies</strong>
    <span v-for="ally in allies">{{ ally.quantity }} <id-link :id="ally.id" :name="ally.name" /></span>
    <span
      >({{ totalEnemyXP }} XP, challenge: {{ adjustedTotalEnemyXP }} XP) <i>{{ difficulty }}</i></span
    >
  </div>
</template>

<script>
export default {
  name: 'Encounter',
  inject: ['campaignStore', 'partyStore'],
  props: {
    initialEnemies: {
      type: Array,
      required: true,
    },
    initialAllies: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      enemies: [...this.initialEnemies].map(enemy => {
        const monster = this.campaignStore.state.monsters.find(monster => monster.name === enemy.name)
        if (!monster) {
          throw new Error(`Monster ${enemy.name} not found!`)
        }
        return {
          ...enemy,
          monster,
        }
      }),
      allies: [...this.initialAllies],
    }
  },
  computed: {
    totalEnemyXP() {
      return this.enemies.reduce((total, enemy) => total + enemy.quantity * enemy.monster.xp, 0)
    },
    numberOfEnemies() {
      return this.enemies.reduce((total, enemy) => total + enemy.quantity, 0)
    },
    adjustedTotalEnemyXP() {
      let multiplier = 1
      if (this.numberOfEnemies === 2) {
        multiplier = 1.5
      } else if (3 <= this.numberOfEnemies <= 6) {
        multiplier = 2
      } else if (7 <= this.numberOfEnemies <= 10) {
        multiplier = 2.5
      } else if (11 <= this.numberOfEnemies <= 14) {
        multiplier = 3
      } else if (15 <= this.numberOfEnemies) {
        multiplier = 3
      }
      return this.totalEnemyXP * multiplier
    },
    difficulty() {
      const partyLimits = [
        { xp: this.partyStore.state.encounterLimits.deadly, difficulty: 'deadly' },
        { xp: this.partyStore.state.encounterLimits.hard, difficulty: 'hard' },
        { xp: this.partyStore.state.encounterLimits.medium, difficulty: 'medium' },
        { xp: this.partyStore.state.encounterLimits.easy, difficulty: 'easy' },
      ]
      for (let limit in partyLimits) {
        if (this.adjustedTotalEnemyXP >= limit.xp) {
          return limit.difficulty
        }
      }
      return 'trivial'
    },
  },
}
</script>

<style scoped>
.encounter {
}
</style>
