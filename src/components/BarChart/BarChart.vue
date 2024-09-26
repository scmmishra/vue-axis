<script setup lang="ts">
import { computed, watchEffect } from "vue";
import useGeometry from "./useGeometry";

export interface Props {
  labels: string[];
  dataset: { values: number[]; name: string; color: string }[];
  height?: number;
  maxWidth?: number;
  spaceRatio?: number;
  offset?: number;
}

const props = withDefaults(defineProps<Props>(), {
  offset: 50,
  spaceRatio: 0.2,
  maxWidth: 800,
});

const { chartWidth, chartHeight, yOffset, parentWidth, parentHeight } =
  useGeometry(props);

const maxValue = computed(() => {
  return Math.max(...props.dataset.map((item) => Math.max(...item.values)));
});

const yScale = computed(() => {
  return chartHeight.value / maxValue.value;
});

const xScale = computed(() => {
  return chartWidth.value / props.labels.length;
});

const barWidth = computed(() => {
  return xScale.value * (1 - props.spaceRatio);
});

function getHeight(value: number) {
  return value * yScale.value;
}
</script>

<template>
  <pre>{{
    {
      chartWidth,
      chartHeight,
      yOffset,
      xScale,
      yScale,
      parentWidth,
      parentHeight,
      maxWidth,
    }
  }}</pre>
  <svg :width="chartWidth" :height="chartHeight">
    <g v-for="item in dataset" :data-q-name="item.name">
      <rect
        v-for="(value, index) in item.values"
        :x="index * xScale"
        :y="yOffset - getHeight(value)"
        :width="barWidth"
        :height="getHeight(value)"
        :fill="item.color"
      />
    </g>
  </svg>
</template>
