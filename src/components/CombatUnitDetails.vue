<template>
  <div class="combat-unit-details">
    <turn-indicator :class="{ on: true, invisible: unitIdInTurn !== unit.id }" />
    <button class="close-button" title="Remove selection" @click="updateUnit({ ...unit, selected: false })">
      X
    </button>
    <div @mouseover="hover = true" @mouseleave="hover = false">
      <span>{{ unit.name }}</span>
    </div>
    <div class="unit-hit-points">
      <input
        v-model="unit.hitPoints"
        type="number"
        :size="unit.maxHitPoints && unit.maxHitPoints.toString().length"
        min="0"
        value="0"
        @input="updateUnit({ ...unit, hitPoints: parseInt($event.target.value) })"
      />
      / {{ unit.maxHitPoints }}
    </div>
    <div v-if="hover" class="unit-tooltip"><monster id="" v-bind="unit" /></div>
    <condition-menu class="unit-conditions" :creature="unit" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ConditionMenu from './ConditionMenu.vue'
import TurnIndicator from './TurnIndicator.vue'
export default {
  name: 'CombatUnitDetails',
  components: {
    ConditionMenu,
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
      hover: false,
    }
  },
  computed: {
    ...mapState({
      unitIdInTurn: state => state.combat.unitIdInTurn,
    }),
  },
  methods: {
    ...mapActions('combat', ['updateUnit']),
  },
}
</script>

<style scoped>
.combat-unit-details {
  position: relative;
  display: grid;
  width: 100%;
  grid-template-columns: 1rem 2rem 10rem 1fr;
  grid-template-rows: auto 1fr;
  align-items: center;
  justify-items: flex-start;
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
  width: 2rem;
  margin-left: 0.5rem;
  height: 0.75rem;
  margin-right: 0.5rem;
}
.hp-button {
  width: 1rem;
  height: 1rem;
  font-size: 0.75rem;
  padding: 0;
}
.unit-tooltip {
  position: absolute;
  top: 1rem;
  left: 0;
  min-width: 25rem;
  max-width: 40rem;
  z-index: 3;
}
.unit-conditions {
  grid-column: 1 / span 4;
  justify-self: flex-end;
}
.invisible {
  visibility: hidden;
}
</style>
