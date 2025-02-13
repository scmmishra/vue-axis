<script lang="ts" setup>
import { ref, watch } from 'vue'
import { provideAxisChart } from '../../composables/AxisChart/provider'
import useDataset from '../../composables/AxisChart/useDataset'

import useGeometry from '../../composables/AxisChart/useGeometry'

import BarRect from './BarRect.vue'
import HoverRect from './HoverRect.vue'
import SVGText from './SVGText.vue'

export interface DatasetItem {
  values: number[]
  name: string
  color: string
  type?: 'bar' | 'line'
}

export interface Props {
  labels: Array<string | number | Date>
  dataset: { values: number[], name: string, color: string }[]
  stacked?: boolean
  height?: number
  maxWidth?: number
  spaceRatio?: number
  xOffset?: number
  yOffset?: number
  disableAnimation?: boolean
  animationDuration?: number
  formatX?: (label: string | number | Date) => number | string
  formatY?: (tick: number) => number | string
}

const props = withDefaults(defineProps<Props>(), {
  stacked: false,
  xOffset: 20,
  yOffset: 20,
  spaceRatio: 0.2,
  maxWidth: 800,
  disableAnimation: false,
  animationDuration: 100,
})

const hoverIndex = ref(-1)
const hoverRectX = ref(0)
const isHovering = ref(false)

const getAnimationDelay = (index: number) => index * 2
function isDate(obj: string | number | Date) {
  return Object.prototype.toString.call(obj) === '[object Date]'
}

function formatTick(tick: number) {
  if (props.formatY) {
    return props.formatY(tick)
  }

  return tick
}

function formatLabel(label: string | number | Date) {
  if (isDate(label) && !props.formatX) {
    return (label as Date).toLocaleDateString()
  }

  if (props.formatX) {
    return props.formatX(label)
  }

  return label
}

const { maxValue, ticks, maxEffectiveValue, cleanedDataset }
  = useDataset(props)

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
} = useGeometry(props, maxEffectiveValue)

watch(hoverIndex, (newIndex) => {
  if (newIndex !== -1) {
    hoverRectX.value = getXPosition(newIndex) - barGap.value / 2
    isHovering.value = true
  }
  else {
    isHovering.value = false
  }
})

provideAxisChart({
  yOffset: props.yOffset,
  xOffset: props.xOffset,
  animationDuration: props.animationDuration,
  disableAnimation: props.disableAnimation,
  stacked: props.stacked,
  spaceRatio: props.spaceRatio,
  dataset: cleanedDataset,

  hoverIndex,
  getAnimationDelay,

  // from useGeometry
  leftmargin,
  containerWidth,
  containerHeight,
  barWidth,
  barGap,
  getHeight,
  getYPosition,
  getXPosition,
  drawWidth,

  // from useDataset
  maxValue,
  ticks,
  maxEffectiveValue,
})
</script>

<template>
  <svg :width="containerWidth" :height="containerHeight">
    <HoverRect v-if="isHovering" />
    <g class="va-y-ticks">
      <SVGText
        v-for="(value, index) in ticks"
        :key="`tick-${value}-${index}`"
        :x="leftmargin - 10"
        :y="getYPosition(value) + 3"
        text-anchor="end"
      >
        {{ formatTick(value) }}
      </SVGText>
    </g>
    <g class="va-x-ticks">
      <SVGText
        v-for="(label, index) in labels"
        :key="`${label}-${index}`"
        :x="getXPosition(index) + barWidth / 2"
        :y="containerHeight"
        :width="barWidth"
        text-anchor="middle"
      >
        {{ formatLabel(label) }}
      </SVGText>
    </g>
    <g class="va-axis-lines">
      <line
        v-for="(value, index) in ticks"
        :key="`line-${value}-${index}`"
        stroke="#e5e7eb"
        :width="containerWidth - leftmargin"
        :x1="leftmargin"
        :x2="containerWidth"
        :y1="getYPosition(value)"
        :y2="getYPosition(value)"
      />
    </g>
    <g
      v-for="(item, outerIdx) in cleanedDataset"
      :key="item.name"
      :data-va-name="item.name"
      :data-width="drawWidth"
      class="va-bars"
    >
      <BarRect
        v-for="(value, index) in item.values"
        :key="`bar-${index}-${item.name}`"
        :color="item.color"
        :value="value"
        :index="index"
        :name="item.name"
        :outer-idx="outerIdx"
        :stacked="props.stacked"
      />
    </g>
    <g class="va-hover-triggers" style="opacity: 0">
      <rect
        v-for="(_, index) in labels"
        :key="`trigger-${index}`"
        :x="getXPosition(index) - barGap / 2"
        :y="yOffset"
        :data-idx="index"
        :width="barWidth + barGap"
        :height="containerHeight - 2 * yOffset"
        fill="transparent"
        @mouseover="() => (hoverIndex = index)"
        @mouseleave="() => (hoverIndex = -1)"
      />
    </g>
  </svg>
</template>
