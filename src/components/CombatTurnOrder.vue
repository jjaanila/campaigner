<template>
  <div class="combat-turn-order">
    <div v-for="unit in orderedUnits" :key="unit.id" class="combat-turn-unit-container">
      <span v-if="unit.id === unitIdInTurn" class="combat-turn-indicator" />
      <combat-character
        v-if="unit.unitType === 'character'"
        :key="unit.id"
        class="combat-unit"
        :character="unit"
        @click="setUnitIdInTurn(unit.id)"
      />
      <combat-ally
        v-if="unit.unitType === 'ally'"
        :key="unit.id"
        class="combat-unit"
        :monster="unit"
        @click="setUnitIdInTurn(unit.id)"
      />
      <combat-enemy
        v-if="unit.unitType === 'enemy'"
        :key="unit.id"
        class="combat-unit"
        :monster="unit"
        @click="setUnitIdInTurn(unit.id)"
      />
    </div>
  </div>
</template>

<script>
import CombatEnemy from './CombatEnemy.vue'
import CombatAlly from './CombatAlly.vue'
import CombatCharacter from './CombatCharacter.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'CombatTurnOrder',
  components: {
    CombatEnemy,
    CombatAlly,
    CombatCharacter,
  },
  computed: {
    ...mapState({
      turnOrder: state => state.combat.turnOrder,
      characters: state => state.combat.characters,
      enemies: state => state.combat.enemies,
      allies: state => state.combat.allies,
      unitIdInTurn: state => state.combat.unitIdInTurn,
    }),
    orderedUnits() {
      return this.turnOrder.map(id => {
        const unit = [...this.characters, ...this.enemies, ...this.allies].find(c => c.id === id)
        if (!unit) {
          throw new Error(`Could not find unit with id ${id}`)
        }
        return unit
      })
    },
  },
  methods: {
    ...mapActions('combat', ['setUnitIdInTurn']),
  },
}
</script>

<style scoped>
.combat-turn-order {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}
.combat-turn-unit-container {
  position: relative;
  margin-right: 0.5rem;
}
.combat-turn-indicator {
  position: absolute;
  top: -0.75rem;
  left: calc(50% - 5px);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: red;
}
.combat-unit {
  width: 20px;
  height: 20px;
}
</style>
