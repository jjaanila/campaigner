<template>
  <div class="combat-turn-order">
    <span class="combat-turn-order-first">First</span>
    <div v-for="unit in orderedUnits" :key="unit.id" class="combat-turn-unit-container">
      <span v-if="unit.id === unitIdInTurn" class="combat-turn-indicator on" />
      <span
        v-if="unit.id !== unitIdInTurn"
        class="combat-turn-indicator off"
        @click="setUnitIdInTurn(unit.id)"
      />
      <combat-character
        v-if="unit.unitType === 'character'"
        :key="unit.id"
        class="combat-unit"
        :character="unit"
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
        :monster="unit"
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
        :monster="unit"
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
.combat-turn-indicator {
  position: absolute;
  top: -0.8rem;
  left: calc(50% - 5px);
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  background-color: black;
}
.combat-turn-indicator.on {
  opacity: 1;
}
.combat-turn-indicator.off {
  cursor: pointer;
  opacity: 0.25;
}
.combat-turn-indicator.off:hover {
  opacity: 0.5;
}
</style>
