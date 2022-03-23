<template>
  <div
    class="combat-unit-details"
    :style="{
      border: unit.hovered ? '2px dashed black' : undefined,
    }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <turn-indicator :class="{ on: unitIdInTurn === unit.id }" />
    <button class="close-button" title="Remove selection" @click="updateUnit({ ...unit, selected: false })">
      X
    </button>
    <span>{{ unit.name }} ({{ unit.unitType }})</span>
    <div class="unit-hit-points">
      <input
        v-model="unit.hitPoints"
        type="number"
        :size="unit.maxHitPoints && unit.maxHitPoints.toString().length"
        min="0"
        @input="updateUnit({ ...unit, hitPoints: parseInt($event.target.value) || 0 })"
      />
      / {{ unit.maxHitPoints }}
    </div>
    <div class="color-marker" :style="{ backgroundColor: unit.color }" />
    <condition-menu class="unit-conditions" :creature="unit" />
    <button v-if="isHorde(unit)" class="unit-split-horde-button" @click="splitHorde(unit.id)">
      Split Horde
    </button>
    <Monster v-show="isDetailHovered" class="unit-monster" v-bind="unit.monster" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ConditionMenu from './ConditionMenu.vue'
import TurnIndicator from './TurnIndicator.vue'
import Monster from './Monster.vue'
import { isHorde } from '../stores/combat.store'
export default {
  name: 'CombatUnitDetails',
  components: {
    ConditionMenu,
    Monster,
    TurnIndicator,
  },
  props: {
    unit: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isDetailHovered: false,
    }
  },
  computed: {
    ...mapState({
      unitIdInTurn: state => state.combat.unitIdInTurn,
    }),
  },
  methods: {
    ...mapActions('combat', ['updateUnit', 'splitHorde']),
    isHorde,
    onMouseEnter() {
      this.updateUnit({ ...this.unit, hovered: true })
      this.isDetailHovered = true
    },
    onMouseLeave() {
      this.updateUnit({ ...this.unit, hovered: false })
      this.isDetailHovered = false
    },
  },
}
</script>

<style scoped>
.combat-unit-details {
  position: relative;
  display: grid;
  width: 100%;
  padding: 0.25rem;
  grid-template-columns: 1rem 2rem 10rem 1fr;
  grid-template-rows: auto auto auto;
  align-items: center;
  justify-items: flex-start;
  border: 2px solid transparent;
}
.close-button {
  width: 1rem;
  height: 1rem;
  padding: 0;
  font-size: 0.75rem;
  cursor: pointer;
}
.unit-hit-points {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
}
.unit-hit-points > input {
  width: 4rem;
  margin-left: 0.5rem;
  height: 1.25rem;
  margin-right: 0.5rem;
}
.hp-button {
  width: 1rem;
  height: 1rem;
  font-size: 0.75rem;
  padding: 0;
}
.unit-monster {
  grid-column: 1 / span 4;
}
.unit-conditions {
  grid-column: 2 / span 4;
  justify-self: flex-end;
  margin-top: 0.25rem;
}
.unit-split-horde-button {
  grid-column: 4;
  justify-self: flex-end;
  margin-top: 0.25rem;
}
.invisible {
  visibility: hidden;
}
.color-marker {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid black;
  margin-left: 0.5rem;
}
</style>
