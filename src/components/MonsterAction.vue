<template>
  <div class="monster-action" tabindex="0" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <div
      v-show="canHit && isHovered"
      class="rollable-mask hit-mask"
      tabindex="0"
      :role="canHit ? 'button' : ''"
      @click="rollHit"
    >
      Roll hit
    </div>
    <div
      v-show="hasDamage && isHovered"
      class="rollable-mask damage-mask"
      tabindex="0"
      :role="hasDamage ? 'button' : ''"
      @click="rollDamage"
    >
      Roll damage
    </div>
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
    canHit() {
      return this.toHit !== undefined
    },
    hasDamage() {
      return this.damage
    },
  },
  methods: {
    ...mapActions('ui', ['throwDice']),
    rollHit() {
      this.throwDice({ throws: 1, sides: 20, constant: this.toHit, description: `To hit with ${this.name}` })
    },
    rollDamage() {
      this.throwDice({ ...this.damage, description: `${this.name} damage` })
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
  background: rgba(0, 0, 0, 0.4);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
}
.rollable-mask:hover {
  background: rgba(0, 0, 0, 0.6);
}
.hit-mask {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 50%;
}
.damage-mask {
  position: absolute;
  top: 0;
  left: 50%;
  height: 100%;
  width: 50%;
}
.monster-action-name {
  font-weight: bold;
  font-style: italic;
  white-space: nowrap;
}
</style>
