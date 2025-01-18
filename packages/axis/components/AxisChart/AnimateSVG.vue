<script lang="ts" setup>
import { useAxisChart } from '../../composables/AxisChart/provider'

interface Props {
  delay?: number
}

withDefaults(defineProps<Props>(), {
  delay: 0
})

const { animationDuration, disableAnimation } = useAxisChart()
</script>

<template>
  <animate
    v-if="!disableAnimation"
    :dur="`${animationDuration}ms`"
    :begin="`${delay}ms`"
    fill="freeze"
    calcMode="spline"
    keySplines="0.215, 0.61, 0.355, 1"
  />
</template>
