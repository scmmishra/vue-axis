<script setup>
import SVGText from "./SVGText.vue";
import HoverRect from "./HoverRect.vue";
import { computed, ref, watch, provide } from "vue";
import useGeometry from "./useGeometry";
import useNiceNumbers from "./useNiceNumbers";

/**
 * @typedef {Object} DatasetItem
 * @property {number[]} values - Array of numerical values
 * @property {string} name - Name of the dataset
 * @property {string} color - Color of the dataset
 */

/**
 * @type {import('vue').PropType<{
 *   labels: string[],
 *   dataset: DatasetItem[],
 *   height?: number,
 *   maxWidth?: number,
 *   spaceRatio?: number,
 *   xOffset?: number,
 *   yOffset?: number,
 *   disableAnimation?: boolean,
 *   animationDuration?: number
 * }>}
 */
const props = defineProps({
  labels: { type: Array, required: true },
  dataset: { type: Array, required: true },
  height: { type: Number, default: null },
  maxWidth: { type: Number, default: 800 },
  spaceRatio: { type: Number, default: 0.2 },
  xOffset: { type: Number, default: 20 },
  yOffset: { type: Number, default: 20 },
  disableAnimation: { type: Boolean, default: false },
  animationDuration: { type: Number, default: 100 },
  formatX: { type: Function, default: null },
  formatY: { type: Function, default: null },
});

const hoverIndex = ref(null);
const hoverRectX = ref(0);
const isHovering = ref(false);

const maxValue = computed(() => {
  return Math.max(...props.dataset.map((item) => Math.max(...item.values)));
});
const ticks = computed(() => useNiceNumbers(0, maxValue.value));
const maxEffectiveValue = computed(() => ticks.value[ticks.value.length - 1]);

const getAnimationDelay = (index) => index * 2;
const isDate = (obj) => Object.prototype.toString.call(obj) === "[object Date]";

const formatTick = (tick) => {
  if (props.formatY) {
    return props.formatY(tick);
  }

  return tick;
};

const formatLabel = (label) => {
  if (isDate(label) && !props.formatX) {
    return label.toLocaleDateString();
  }

  if (props.formatX) {
    return props.formatX(label);
  }

  return label;
};

const {
  leftmargin,
  containerWidth,
  containerHeight,
  barWidth,
  barGap,
  getHeight,
  getYPosition,
  getXPosition,
  drawWidth,
} = useGeometry(props, maxEffectiveValue);

watch(hoverIndex, (newIndex) => {
  if (newIndex !== null) {
    hoverRectX.value = getXPosition(newIndex) - barGap.value / 2;
    isHovering.value = true;
  } else {
    isHovering.value = false;
  }
});

provide("hoverIndex", hoverIndex);
provide("getXPosition", getXPosition);
provide("barWidth", barWidth);
provide("barGap", barGap);
provide("containerHeight", containerHeight);
provide("yOffset", props.yOffset);
</script>

<template>
  <svg :width="containerWidth" :height="containerHeight">
    <HoverRect />
    <g class="q-y-ticks">
      <SVGText
        v-for="value in ticks"
        :x="leftmargin - 10"
        :y="getYPosition(value) + 3"
        text-anchor="end"
      >
        {{ formatTick(value) }}
      </SVGText>
    </g>
    <g class="q-x-ticks">
      <SVGText
        v-for="(label, index) in labels"
        :x="getXPosition(index) + barWidth / 2"
        :y="containerHeight"
        :width="barWidth"
        text-anchor="middle"
      >
        {{ formatLabel(label) }}
      </SVGText>
    </g>
    <g class="q-axis-lines">
      <line
        v-for="value in ticks"
        stroke="#e5e7eb"
        :width="containerWidth - leftmargin"
        :x1="leftmargin"
        :x2="containerWidth"
        :y1="getYPosition(value)"
        :y2="getYPosition(value)"
      />
    </g>
    <g
      v-for="item in dataset"
      :data-q-name="item.name"
      :data-width="drawWidth"
      class="q-bars"
    >
      <rect
        v-for="(value, index) in item.values"
        :x="getXPosition(index)"
        :y="containerHeight - props.yOffset"
        :data-idx="index"
        :width="barWidth"
        :height="0"
        :fill="item.color"
      >
        <animate
          v-if="!disableAnimation"
          attributeName="height"
          :from="0"
          :to="getHeight(value)"
          :dur="`${props.animationDuration}ms`"
          :begin="`${getAnimationDelay(index)}ms`"
          fill="freeze"
          calcMode="spline"
          keySplines="0.215, 0.61, 0.355, 1"
        />
        <animate
          v-if="!disableAnimation"
          attributeName="y"
          :from="containerHeight - props.yOffset"
          :to="getYPosition(value)"
          :dur="`${props.animationDuration}ms`"
          :begin="`${getAnimationDelay(index)}ms`"
          fill="freeze"
          calcMode="spline"
          keySplines="0.215, 0.61, 0.355, 1"
        />
      </rect>
    </g>
    <g class="q-hover-triggers" style="opacity: 0">
      <rect
        v-for="(_, index) in labels"
        :x="getXPosition(index) - barGap / 2"
        :y="yOffset"
        :data-idx="index"
        :width="barWidth + barGap"
        :height="containerHeight - 2 * yOffset"
        fill="transparent"
        @mouseover="() => (hoverIndex = index)"
        @mouseleave="() => (hoverIndex = null)"
      />
    </g>
  </svg>
</template>
