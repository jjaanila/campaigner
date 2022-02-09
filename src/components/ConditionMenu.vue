<template>
  <div class="condition-menu">
    <button
      class="condition available-condition"
      v-on:click="addConditionToCreature(condition)"
      v-if="isConditionMenuOpen"
      v-for="condition in sortByKey([...availableConditions], 'name')"
      :key="condition.name"
      :title="condition.name"
    >
      {{ condition.name.slice(0, 3) }}
    </button>
    <button
      class="condition active-condition"
      v-for="condition in sortByKey([...creature.conditions], 'name')"
      v-on:click="removeCondition({ characterName: creature.name, conditionName: condition.name })"
      :key="condition.name"
      :title="condition.name"
    >
      {{ condition.name.slice(0, 3) }}
    </button>
    <button
      class="condition-menu-close-button"
      v-if="isConditionMenuOpen"
      v-on:click="isConditionMenuOpen = false"
      title="Close"
    >
      -
    </button>
    <button
      class="condition-menu-add-button"
      v-if="!isConditionMenuOpen"
      v-on:click="isConditionMenuOpen = true"
      title="Add condition"
    >
      +
    </button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { sortByKey } from '../utils'
export default {
  name: 'ConditionMenu',
  props: {
    creature: {
      type: Object,
    },
  },
  data() {
    return {
      isConditionMenuOpen: false,
    }
  },
  computed: {
    ...mapState({
      conditions: state => state.campaign.conditions,
    }),
    availableConditions() {
      return this.conditions.filter(condition => !this.creature.conditions.some(c => c.name === condition.name), 'name')
    },
  },
  methods: {
    ...mapActions('party', ['addCondition', 'removeCondition']),
    addConditionToCreature(condition) {
      this.addCondition({ characterName: this.creature.name, conditionName: condition.name })
    },
    sortByKey,
  },
}
</script>

<style>
.condition {
  width: 2rem;
  padding: 0 0.2rem;
}
.available-conditions {
  display: flex;
  flex-flow: row wrap;
}
.available-condition {
  color: #58180d;
}
.active-condition {
  color: green;
}
.condition-menu {
  display: flex;
  flex-flow: row wrap;
}
</style>
