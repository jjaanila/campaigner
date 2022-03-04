<template>
  <div v-click-outside="close" class="condition-menu">
    <div v-if="isConditionMenuOpen" class="available-conditions">
      <button
        v-for="condition in sortBy([...availableConditions], 'name')"
        :key="condition.name"
        class="condition available-condition"
        :title="condition.name"
        @click="addConditionToCreature(creature.id, condition.name)"
      >
        {{ condition.name.slice(0, 3) }}
      </button>
    </div>
    <button
      v-for="condition in sortBy([...creature.conditions], 'name')"
      :key="condition.name"
      class="condition active-condition"
      :title="condition.name"
      @click="removeConditionFromCreature(creature.id, condition.name)"
    >
      {{ condition.name.slice(0, 3) }}
    </button>
    <button
      class="condition-menu-open-button"
      :title="isConditionMenuOpen ? 'Close' : 'Add condition'"
      @click="isConditionMenuOpen = !isConditionMenuOpen"
    >
      {{ isConditionMenuOpen ? '-' : '+' }}
    </button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import sortBy from 'lodash/sortBy'
import ClickOutside from 'vue-click-outside'
export default {
  name: 'ConditionMenu',
  directives: {
    ClickOutside,
  },
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
    close() {
      this.isConditionMenuOpen = false
    },
    sortBy,
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
.condition-menu {
  position: relative;
  display: flex;
  flex-flow: row wrap;
}
.condition-menu-open-button {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
