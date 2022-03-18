<template>
  <div
    class="monster-action"
    :role="rollable ? 'button' : ''"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="roll"
  >
    <div v-show="rollable && isHovered" class="rollable-mask">Roll</div>
    <span class="monster-action-description">
      <span class="monster-action-name">{{ name }}.</span>
      {{ descriptionStr }}
    </span>
  </div>
</template>

<script>
import Dice from '../Dice'
import { mapActions } from 'vuex'
export default {
  name: 'MonsterAction',
  props: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: [String],
    },
    type: {
      type: String,
    },
    toHit: {
      type: Number,
    },
    reachFt: {
      type: Number,
    },
    rangeFt: {
      type: Number,
    },
    disadvantageRangeFt: {
      type: Number,
    },
    damageType: {
      type: String,
    },
    damage: {
      type: Dice,
    },
    extra: {
      type: String,
    },
  },
  data() {
    return {
      isHovered: false,
    }
  },
  computed: {
    descriptionStr() {
      if (this.description) {
        return this.description
      }
      const attackTypeStr = `${
        this.type === 'melee'
          ? 'Melee Attack: '
          : this.type === 'ranged'
          ? 'Ranged Attack: '
          : 'Melee or Ranged Attack: '
      }`
      const toHitStr = this.toHit ? `${this.toHit > 0 ? '+' : ''}${this.toHit} to hit` : ''
      const reachStr = this.reachFt ? `reach ${this.reachFt} ft.` : ''
      const rangeStr =
        this.rangeFt || this.disadvantageRangeFt
          ? `range ${this.rangeFt ?? 0}/${this.disadvantageRangeFt ?? 0} ft.`
          : ''
      const reachRangeStr =
        reachStr || rangeStr ? `, ${reachStr}${reachStr && rangeStr ? ' or ' : ''}${rangeStr}` : ''
      const hitStr = ` Hit: ${this.damage.toString()} ${this.damageType} damage`
      return `${attackTypeStr}${toHitStr}${reachRangeStr}${hitStr}. ${this.extra ?? ''}`
    },
    rollable() {
      return this.toHit > 0 || this.damage
    },
  },
  methods: {
    ...mapActions('ui', ['throwDice']),
    roll() {
      this.throwDice({ throws: 1, sides: 20, constant: this.toHit, description: `To hit with ${this.name}` })
      this.throwDice({ ...this.damage, description: this.name })
    },
  },
}
</script>

<style scoped>
.monster-action {
  position: relative;
  text-indent: 0;
  display: flex;
  flex-flow: row nowrap;
}
.rollable-mask {
  cursor: pointer;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
}
.monster-action-name {
  font-weight: bold;
  font-style: italic;
  white-space: nowrap;
}
</style>
