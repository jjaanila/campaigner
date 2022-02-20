<template>
  <div class="condition-menu">
    <div v-if="isConditionMenuOpen" class="available-conditions">
      <button
        v-for="condition in sortByKey([...availableConditions], 'name')"
        :key="condition.name"
        class="condition available-condition"
        :title="condition.name"
        @click="addConditionToCreature(creature.id, condition.name)"
      >
        {{ condition.name.slice(0, 3) }}
      </button>
    </div>
    <button
      v-for="condition in sortByKey([...creature.conditions], 'name')"
      :key="condition.name"
      class="condition active-condition"
      :title="condition.name"
      @click="removeConditionFromCreature(creature.id, condition.name)"
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
      isInCombat: state => state.combat.isInCombat,
    }),
    availableConditions() {
      return this.conditions.filter(
        condition => !this.creature.conditions.some(c => c.name === condition.name),
        'name'
      )
    },
  },
  methods: {
    ...mapActions({
      addCombatCondition: 'combat/addCondition',
      removeCombatCondition: 'combat/removeCondition',
      addCharacterCondition: 'party/addCondition',
      removeCharacterCondition: 'party/removeCondition',
    }),
    sortByKey,
    addConditionToCreature(creatureId, conditionName) {
      try {
        this.addCharacterCondition({ characterId: creatureId, conditionName })
      } catch (err) {
        // Not a character. Let's try finding any combat unit
        if (!this.isInCombat) {
          throw err
        }
        this.addCombatCondition({ unitId: creatureId, conditionName })
      }
    },
    removeConditionFromCreature(creatureId, conditionName) {
      try {
        this.removeCharacterCondition({ characterId: creatureId, conditionName })
      } catch (err) {
        // Not a character. Let's try finding any combat unit
        if (!this.isInCombat) {
          throw err
        }
        this.removeCombatCondition({ unitId: creatureId, conditionName })
      }
    },
  },
}
</script>

<style>
.condition {
  width: 2rem;
  height: 1.5rem;
  padding: 0 0.2rem;
}
.available-conditions {
  display: flex;
  flex-flow: column wrap;
  position: absolute;
  right: -0.25rem;
  top: 1.5rem;
  z-index: 4;
}
.available-condition {
  color: #58180d;
}
.active-condition {
  color: green;
}
.condition-menu-close-button {
  height: 1.5rem;
}
.condition-menu {
  position: relative;
  display: flex;
  flex-flow: row wrap;
}
</style>
