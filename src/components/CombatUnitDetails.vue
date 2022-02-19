<template>
  <div class="combat-unit-details">
    <span>{{ unit.name }}</span>
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
  computed: {},
  methods: {
    ...mapActions('combat', ['updateUnit']),
  },
}
</script>

<style scoped>
.combat-unit-details {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
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
</style>
