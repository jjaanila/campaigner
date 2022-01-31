<template>
  <div class="monster-action">
    <span class="monster-action-description">
      <span class="monster-action-name">{{ name }}.</span>
      {{ descriptionStr }}
    </span>
  </div>
</template>

<script>
import Dice from '../Dice'
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
      type: String
    }
  },
  computed: {
    descriptionStr() {
      if (this.description) {
        return this.description
      }
      const attackTypeStr = `${this.type === 'melee' ? 'Melee Attack: ' : this.type === 'ranged' ? 'Ranged Attack: ' : 'Melee or Ranged Attack: '}`
      const toHitStr = this.toHit ? `${this.toHit > 0 ? '+' : ''}${this.toHit} to hit` : ''
      const reachStr = this.reachFt ? `reach ${this.reachFt} ft.` : ''
      const rangeStr = this.normalRangeFt || this.disadvantageRangeFt ? `range ${this.rangeFt ?? 0}/${this.disadvantageRangeFt ?? 0} ft.` : ''
      const reachRangeStr = reachStr || rangeStr ? `, ${reachStr}${reachStr && rangeStr ? ' or ' : ''}${rangeStr}` : ''
      const hitStr = ` Hit: ${this.damage.toString()} ${this.damageType} damage`
      return `${attackTypeStr}${toHitStr}${reachRangeStr}${hitStr}. ${this.extra ?? ''}`
    }
  }
}
</script>

<style scoped>
.monster-action {
  display: flex;
  flex-flow: row nowrap;
}
.monster-action-name {
  font-weight: bold;
  font-style: italic;
  white-space: nowrap;
}
</style>
