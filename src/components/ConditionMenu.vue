<template>
  <div class="condition-menu">
    <div v-if="isConditionMenuOpen" class="available-conditions">
      <button
        v-for="condition in sortByKey([...availableConditions], 'name')"
        :key="condition.name"
        class="condition available-condition"
        :title="condition.name"
        @click="addConditionToCreature(condition)"
      >
        {{ condition.name.slice(0, 3) }}
      </button>
    </div>
    <button
      v-for="condition in sortByKey([...creature.conditions], 'name')"
      :key="condition.name"
      class="condition active-condition"
      :title="condition.name"
      @click="removeCondition({ characterName: creature.name, conditionName: condition.name })"
    >
      {{ condition.name.slice(0, 3) }}
    </button>
    <button
      v-if="isConditionMenuOpen"
      class="condition-menu-close-button"
      title="Close"
      @click="isConditionMenuOpen = false"
    >
      -
    </button>
    <button
      v-if="!isConditionMenuOpen"
      class="condition-menu-add-button"
      title="Add condition"
      @click="isConditionMenuOpen = true"
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
      required: true,
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
      return this.conditions.filter(
        condition => !this.creature.conditions.some(c => c.name === condition.name),
        'name'
      )
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
