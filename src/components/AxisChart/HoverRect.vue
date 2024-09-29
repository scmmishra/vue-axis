<script setup>
import { computed } from "vue";
import { useAxisChart } from "composables/AxisChart/provider";

const { hoverIndex, getXPosition, barWidth, barGap, yOffset, containerHeight } =
  useAxisChart();

const isHovering = computed(() => hoverIndex.value !== null);
const hoverRectX = computed(() =>
  hoverIndex.value !== null
    ? getXPosition(hoverIndex.value) - barGap.value / 2
    : 0,
);

const rectHeight = computed(() => containerHeight.value - 2 * yOffset);
</script>

<template>
  <rect
    class="q-hover-rect"
    :class="{ 'is-hovering': isHovering }"
    :opacity="isHovering ? 0.5 : 0"
    fill="#f1f5f9"
    :x="hoverRectX"
    :y="yOffset"
    :width="barWidth + barGap"
    :height="rectHeight"
  />
</template>

<style scoped>
.q-hover-rect {
  transition:
    x 150ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 150ms cubic-bezier(0.22, 1, 0.36, 1);
}

.q-hover-rect.is-hovering {
  transition:
    x 150ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 150ms cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
