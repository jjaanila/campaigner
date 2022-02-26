<template>
  <div class="dice-overlay">
    <div class="dice-history">
      <span
        v-for="(record, i) in history"
        :key="record.id"
        :class="{ 'dice-last': i === 0, 'dice-record': true }"
        >{{ record.result }} {{ record.dice.toString(false) }}</span
      >
    </div>
    <input
      v-model.number="throws"
      class="dice-overlay-throws"
      type="number"
      min="1"
      value="1"
      @input="setThrows(parseInt($event.target.value) || 1)"
    />
    <button @click="throwDice({ throws, sides: 4 })">{{ throws }}d4</button>
    <button @click="throwDice({ throws, sides: 6 })">{{ throws }}d6</button>
    <button @click="throwDice({ throws, sides: 8 })">{{ throws }}d8</button>
    <button @click="throwDice({ throws, sides: 10 })">{{ throws }}d10</button>
    <button @click="throwDice({ throws, sides: 12 })">{{ throws }}d12</button>
    <button @click="throwDice({ throws, sides: 20 })">{{ throws }}d20</button>
    <button @click="throwDice({ throws, sides: 100 })">{{ throws }}d100</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'DiceOverlay',
  computed: {
    ...mapState({
      last: state => state.ui.dice?.last ?? {},
      history: state => state.ui.dice.history.slice(0, 10),
      throws: state => state.ui.dice.throws,
    }),
  },
  methods: {
    ...mapActions('ui', ['throwDice', 'setThrows']),
  },
}
</script>

<style scoped>
.dice-overlay {
  position: fixed;
  bottom: 0.5rem;
  left: 0.5rem;
}
.dice-overlay-throws {
  width: 3rem;
}
.dice-history {
  display: flex;
  flex-flow: column;
  justify-content: flex-end;
  position: fixed;
  overflow-y: auto;
  bottom: 2rem;
  left: 0.5rem;
  width: 10rem;
  height: 20rem;
}
.dice-last {
  font-weight: bold;
}
.dice-record {
}
</style>
