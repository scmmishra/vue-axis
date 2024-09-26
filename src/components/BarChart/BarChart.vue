<script setup lang="ts">
import { computed, watchEffect } from "vue";
import useGeometry from "./useGeometry";

export interface Props {
  labels: string[];
  dataset: { values: number[]; name: string; color: string }[];
  height?: number;
  maxWidth?: number;
  spaceRatio?: number;
  xOffset?: number;
  yOffset?: number;
}

const props = withDefaults(defineProps<Props>(), {
  xOffset: 20,
  yOffset: 20,
  spaceRatio: 0.2,
  maxWidth: 800,
});

const { chartWidth, chartHeight, parentWidth, parentHeight } =
  useGeometry(props);

const maxValue = computed(() => {
  return Math.max(...props.dataset.map((item) => Math.max(...item.values)));
});

const yScale = computed(() => {
  return chartHeight.value / maxValue.value;
});

const xScale = computed(() => {
  return (chartWidth.value - 2 * props.xOffset) / props.labels.length;
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
      xScale,
      yScale,
      parentWidth,
      parentHeight,
      maxWidth,
    }
  }}</pre>
  <svg :width="chartWidth" :height="chartHeight">
    <line
      stroke="#ccc"
      :x="xScale + xOffset / 2"
      :y="chartHeight - yOffset"
      :width="chartWidth - xOffset"
      :x1="0"
      :x2="chartWidth - xOffset"
      :y1="chartHeight - yOffset"
      :y2="chartHeight - yOffset"
    ></line>
    <g v-for="item in dataset" :data-q-name="item.name">
      <rect
        v-for="(value, index) in item.values"
        :x="index * xScale + xOffset / 2"
        :y="chartHeight - getHeight(value) - yOffset"
        :width="barWidth"
        :height="getHeight(value)"
        :fill="item.color"
      />
    </g>
  </svg>
</template>
