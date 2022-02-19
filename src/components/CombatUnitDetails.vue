<template>
  <div class="combat-unit-details">
    <button class="close-button" @click="updateUnit({ ...unit, selected: false })">X</button>
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
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'CombatUnitDetails',
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
  computed: {},
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
  grid-template-columns: 2rem 10rem 1fr;
  grid-template-rows: auto;
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
</style>
