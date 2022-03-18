<script setup>
import { computed, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import Dice from '../Dice'
import { isHorde } from '../stores/combat.store'
import { getAbilityScoreModifier, getUniqueId } from '../utils'
const store = useStore()
const initiatives = ref({})
const setInitiative = (groupId, initiative) => {
  if (!initiative) {
    return
  }
  initiatives.value[groupId] = parseInt(initiative)
}
const units = computed(() => store.state.combat.units)
const unitGroups = computed(() =>
  units.value.reduce((groups, unit) => {
    const unitGroup = groups.find(group => group.name === unit.name)
    if (isHorde(unit) || unit.type === 'character' || !unitGroup) {
      const id = getUniqueId()
      groups.push({
        name: unit.name,
        units: [unit],
        id,
      })
      setInitiative(
        id,
        unit.monster ? new Dice(1, 20).throw() + getAbilityScoreModifier(unit.monster.dexterity) : ''
      )
      return groups
    }
    unitGroup.units.push(unit)
    return groups
  }, [])
)
const groupInputRefs = {}
unitGroups.value.forEach(group => {
  groupInputRefs[group.id] = ref(null)
})
const sortedGroups = computed(() => {
  return [...unitGroups.value].sort((a, b) => {
    const aInitiative = initiatives.value[a.id]
    const bInitiative = initiatives.value[b.id]
    return (bInitiative ?? 0) - (aInitiative ?? 0)
  })
})
const completeInitialization = () => {
  const turnOrder = sortedGroups.value
    .reduce((flatUnits, group) => {
      return [...flatUnits, ...group.units]
    }, [])
    .map(unit => unit.id)
  store.commit('combat/setTurnOrder', turnOrder)
  store.commit('combat/setUnitIdInTurn', turnOrder[0])
}
const onInitiativeChange = (groupId, $event) => {
  setInitiative(groupId, $event.target.value)
  nextTick(() => {
    groupInputRefs[groupId].focus()
  })
}
</script>

<template>
  <form class="combat-initialization" @submit.prevent="completeInitialization">
    <h2>Initiatives</h2>
    <div v-for="group of sortedGroups" :key="group.id" class="initiative">
      <label :for="`initiative-${group.id}`">{{ group.name }}</label>
      <input
        :id="`initiative-${group.id}`"
        :ref="
          el => {
            groupInputRefs[group.id] = el
          }
        "
        v-model.number="initiatives[group.id]"
        type="number"
        @input="onInitiativeChange(group.id, $event)"
      />
    </div>
    <button class="combat-initialization-start-combat-button" type="button" @click="completeInitialization">
      Start combat
    </button>
  </form>
</template>

<style scoped>
.combat-initialization {
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.combat-initialization-start-combat-button {
  margin-top: 2rem;
}
.initiative {
  display: flex;
  flex-flow: row;
  margin-bottom: 0.25rem;
}
.initiative > label {
  margin-right: 1rem;
}
.initiative > input {
  width: 6rem;
}
</style>
