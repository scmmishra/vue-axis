<script setup lang="ts">
import { computed } from "vue";
import useGeometry from "./useGeometry";
import useNiceNumbers from "./useNiceNumbers";

export interface Props {
  labels: string[];
  dataset: { values: number[]; name: string; color: string }[];
  height?: number;
  maxWidth?: number;
  spaceRatio?: number;
  xOffset?: number;
  yOffset?: number;
}

const leftmargin = 50;

const props = withDefaults(defineProps<Props>(), {
  xOffset: 20,
  yOffset: 20,
  spaceRatio: 0.2,
  maxWidth: 800,
});

const maxValue = computed(() => {
  return Math.max(...props.dataset.map((item) => Math.max(...item.values)));
});
const ticks = computed(() => useNiceNumbers(0, maxValue.value));
const maxEffectiveValue = computed(() => ticks.value[ticks.value.length - 1]);

const { chartWidth, chartHeight, parentWidth, parentHeight } =
  useGeometry(props);

const yScale = computed(() => {
  return (chartHeight.value - 2 * props.yOffset) / maxEffectiveValue.value;
});

const effectiveDrawWidth = computed(() => {
  const widthWithoutMargin = chartWidth.value - leftmargin;
  return widthWithoutMargin - 2 * props.xOffset;
});

const barWidth = computed(() => {
  const xScale = effectiveDrawWidth.value / props.labels.length;
  return xScale * (1 - props.spaceRatio);
});

const barGap = computed(() => {
  const xScale = effectiveDrawWidth.value / props.labels.length;
  return xScale * props.spaceRatio;
});

function getHeight(value: number) {
  return value * yScale.value;
}

function getYPosition(value: number) {
  return chartHeight.value - getHeight(value) - props.yOffset;
}

function getxPosition(index: number) {
  if (index === 0) {
    // shift this by barGap / 2 to align the gap halfway on each side of the bar
    return leftmargin + props.xOffset + barGap.value / 2;
  }

  const effectiveBarWidth = barWidth.value + barGap.value;
  // shift this by barGap / 2 to align the gap halfway on each side of the bar
  return (
    index * effectiveBarWidth + props.xOffset + leftmargin + barGap.value / 2
  );
}
</script>

<template>
  <pre>{{
    {
      chartWidth,
      chartHeight,
      yScale,
      parentWidth,
      parentHeight,
      maxWidth,
      ticks,
    }
  }}</pre>
  <svg :width="chartWidth" :height="chartHeight">
    <g>
      <text
        v-for="value in ticks"
        :x="leftmargin - String(value).length * 6"
        text-anchor="end"
        :y="getYPosition(value) + 3"
      >
        <tspan
          style="
            font-size: 12px;
            font-family: sans-serif;
            fill: #9ca3af;
            font-weight: 300;
          "
        >
          {{ `${value}%` }}
        </tspan>
      </text>
    </g>
    <g>
      <line
        v-for="value in ticks"
        stroke="#e5e7eb"
        :width="chartWidth - leftmargin"
        :x1="leftmargin"
        :x2="chartWidth"
        :y1="getYPosition(value)"
        :y2="getYPosition(value)"
      />
    </g>
    <g
      v-for="item in dataset"
      :data-q-name="item.name"
      :data-width="effectiveDrawWidth"
    >
      <rect
        v-for="(value, index) in item.values"
        :x="getxPosition(index)"
        :y="getYPosition(value)"
        :data-idx="index"
        :width="barWidth"
        :height="getHeight(value)"
        :fill="item.color"
      />
    </g>
  </svg>
</template>
