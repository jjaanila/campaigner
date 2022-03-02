<template>
  <div class="combat-turn-order">
    <span class="combat-turn-order-first">First</span>
    <div v-for="unit in orderedUnits" :key="unit.id" class="combat-turn-unit-container">
      <turn-indicator :class="{ on: unit.id === unitIdInTurn }" @click="setUnitIdInTurn(unit.id)" />
      <combat-character
        v-if="unit.unitType === 'character'"
        :key="unit.id"
        class="combat-unit"
        :unit="unit"
        draggable="true"
        @dragstart="onUnitDragStart($event, unit)"
        @drop="onDropOnUnit($event, unit)"
        @dragover.prevent
        @dragenter.prevent
      />
      <combat-ally
        v-if="unit.unitType === 'ally'"
        :key="unit.id"
        class="combat-unit"
        :unit="unit"
        draggable="true"
        @dragstart="onUnitDragStart($event, unit)"
        @drop="onDropOnUnit($event, unit)"
        @dragover.prevent
        @dragenter.prevent
      />
      <combat-enemy
        v-if="unit.unitType === 'enemy'"
        :key="unit.id"
        class="combat-unit"
        :unit="unit"
        draggable="true"
        @dragstart="onUnitDragStart($event, unit)"
        @drop="onDropOnUnit($event, unit)"
        @dragover.prevent
        @dragenter.prevent
      />
    </div>
    <span>Last</span>
  </div>
</template>

<script>
import CombatEnemy from './CombatEnemy.vue'
import CombatAlly from './CombatAlly.vue'
import CombatCharacter from './CombatCharacter.vue'
import TurnIndicator from './TurnIndicator.vue'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'CombatTurnOrder',
  components: {
    CombatEnemy,
    CombatAlly,
    CombatCharacter,
    TurnIndicator,
  },
  computed: {
    ...mapState({
      turnOrder: state => state.combat.turnOrder,
      unitIdInTurn: state => state.combat.unitIdInTurn,
    }),
    ...mapGetters({
      getUnitById: 'combat/getUnitById',
    }),
    orderedUnits() {
      return this.turnOrder
        .map(id => {
          const unit = this.getUnitById(id)
          if (!unit) {
            throw new Error(`Could not find unit with id ${id}`)
          }
          return unit
        })
        .filter(unit => unit.hitPoints > 0)
    },
  },
  methods: {
    ...mapActions('combat', ['setUnitIdInTurn', 'setTurnOrder']),
    onUnitDragStart(event, movedUnit) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('dragUnit', JSON.stringify({ movedUnit }))
    },
    onDropOnUnit(event, targetUnit) {
      const { movedUnit } = JSON.parse(event.dataTransfer.getData('dragUnit'))
      let newOrderedUnits = [...this.orderedUnits]
      const targetUnitIndex = newOrderedUnits.findIndex(unit => unit.id === targetUnit.id)
      newOrderedUnits = newOrderedUnits.filter(unit => unit.id !== movedUnit.id)
      newOrderedUnits.splice(targetUnitIndex, 0, movedUnit)
      this.setTurnOrder(newOrderedUnits.map(unit => unit.id))
    },
  },
}
</script>

<style scoped>
.combat-turn-order {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  font-family: 'Merriweather', sans-serif;
}
.combat-turn-unit-container {
  position: relative;
  margin-right: 0.5rem;
}
.combat-turn-order > span {
  margin-right: 0.5rem;
}
.turn-indicator {
  position: absolute;
  top: -0.8rem;
  left: calc(50% - 5px);
}
</style>
