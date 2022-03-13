<script setup>
import { computed, ref } from 'vue'
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
      if (unit.monster) {
        setInitiative(id, new Dice(1, 20).throw() + getAbilityScoreModifier(unit.monster.dexterity))
      }
      return groups
    }
    unitGroup.units.push(unit)
    return groups
  }, [])
)
const sortedGroups = computed(() => {
  return [...unitGroups.value].sort((a, b) => {
    const aInitiative = initiatives.value[a.id]
    const bInitiative = initiatives.value[b.id]
    return bInitiative - aInitiative
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
</script>

<template>
  <form class="combat-initialization" @submit.prevent="completeInitialization">
    <h2>Initiatives</h2>
    <div v-for="group of sortedGroups" :key="group.id" class="initiative">
      <label :for="`initiative-${group.id}`">{{ group.name }}</label>
      <input
        :id="`initiative-${group.id}`"
        v-model.number="initiatives[group.id]"
        type="number"
        @input="setInitiative(group.id, $event.target.value)"
      />
    </div>
    <button @click="completeInitialization">Start combat</button>
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
