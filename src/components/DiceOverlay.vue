<template>
  <div class="dice-overlay">
    <div
      v-if="history.length"
      class="dice-history"
      :style="{
        background: `url(${backgroundImage})`,
      }"
    >
      <span v-for="record in history" :key="record.id" class="dice-record">
        <span class="dice-record-result">{{ record.result }}</span>
        <span class="dice-record-dice">({{ record.dice.toString(false) }})</span>
        <span v-if="record.description" class="dice-record-description">
          {{ record.description }}
        </span>
      </span>
    </div>
    <label class="dice-overlay-throws-label" for="dice-overlay-throws">Throws</label>
    <input
      id="dice-overlay-throws"
      class="dice-overlay-throws"
      type="number"
      min="1"
      :value="throws"
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
  data() {
    return { backgroundImage: require('../img/paper.jpg') }
  },
  computed: {
    ...mapState({
      history: state => state.ui.dice.history,
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
.dice-overlay-throws-label {
  margin-right: 0.5rem;
}
.dice-history {
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  position: fixed;
  overflow-y: auto;
  bottom: 2.5rem;
  left: 0.5rem;
  max-height: 15rem;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #c9ad6a;
  box-shadow: 0.1rem 0.2rem 0.2rem rgba(0, 0, 0, 0.3);
}
.dice-record {
  padding: 0 0 0 0.25rem;
  display: inline-flex;
  align-items: center;
}
.dice-record-result {
  font-weight: bold;
  margin-right: 0.25rem;
  font-size: 1.25rem;
}
.dice-record-dice {
  margin-right: 0.5rem;
}
.dice-record-description {
  margin-left: auto;
  font-size: 1rem;
  font-weight: lighter;
  font-weight: bold;
  font-style: italic;
}
</style>
