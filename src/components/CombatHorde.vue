<template>
  <div
    :class="{ 'combat-unit': true, selected: horde.selected, dead: horde.hitPoints === 0 }"
    :title="`Horde of ${horde.quantity} ${horde.monster.name}`"
    @dragstart="$emit('dragstart', $event)"
    @click="onClick($event)"
    @drop="$emit('drop', $event)"
    @dragover.prevent
    @dragenter.prevent
  >
    {{ `${horde.quantity}${horde.monster.name.slice(0, 2)}` }}
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'CombatHorde',
  props: {
    horde: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ...mapActions('combat', ['updateUnit']),
    onClick($event) {
      this.updateUnit({ ...this.horde, selected: !this.horde.selected })
      this.$emit('click', $event)
    },
  },
}
</script>

<style scoped>
.combat-unit {
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.75rem;
}
.combat-unit:hover {
  filter: brightness(90%);
  transition: all 0.2s ease;
  cursor: pointer;
}
.selected {
  box-sizing: border-box;
  border: solid black;
}
.dead {
  color: white;
  font-weight: bold;
}
</style>
