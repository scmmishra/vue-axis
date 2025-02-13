<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useAxisChart } from '../../composables/AxisChart/provider'
import AnimateSVG from './AnimateSVG.vue'

interface Props {
  value: number
  name: string
  outerIdx: number
  index: number
  color: string
  stacked: boolean
}

const props = withDefaults(defineProps<Props>(), {})

const renderKey = ref(0)
watch(
  () => [props.value, props.outerIdx, props.index, props.stacked],
  () => {
    // [TODO] Find a better way to figure this out
    // Remove this and see, the bar rects when toggled between stacked and grouped
    // doesn't render correctly if animations are present
    renderKey.value++ // Increment the key to force re-render
  },
)

const {
  getXPosition,
  getYPosition,
  barWidth,
  yOffset,
  containerHeight,
  getHeight,
  getAnimationDelay,
  dataset,
  spaceRatio,
} = useAxisChart()

function getPreviousHeight(index: number, datasetIdx: number): number {
  if (datasetIdx === 0) {
    return 0
  }

  const prevValues = dataset.value[datasetIdx - 1]
  const previousValue = prevValues.values[index]

  // count down to zero idx to capture the heights of all pervious datasets
  return getHeight(previousValue) + getPreviousHeight(index, datasetIdx - 1)
}

const barHeight = computed(() => getHeight(props.value))
const startY = computed(() => containerHeight.value - yOffset)

const numberOfCols = computed(() => {
  if (props.stacked) {
    return 1
  }
  return dataset.value.length
})

const columnWidth = computed(() => {
  if (props.stacked) {
    return barWidth.value
  }
  return (barWidth.value * (1 - spaceRatio)) / numberOfCols.value
})

const xPos = computed(() => {
  if (props.stacked) {
    // For stacked bars, all bars in a stack share the same x-position
    // Just return the x-position for this index
    return getXPosition(props.index)
  }
  // For non-stacked (grouped) bars, we need to calculate the position
  // within the group

  // Calculate the total width occupied by all columns in a group
  const totalColumnWidth = columnWidth.value * numberOfCols.value

  // Calculate the total gap width between and around columns in a group
  const totalGapWidth = barWidth.value - totalColumnWidth

  // Calculate the width of each gap between columns
  const gapBetweenColumns = totalGapWidth / (numberOfCols.value + 1)

  // Calculate the x-position:
  return (
    getXPosition(props.index) // Start with the base x-position for this group
    + gapBetweenColumns * (props.outerIdx + 1) // Add gaps before this column
    + columnWidth.value * props.outerIdx // Add width of previous columns
  )

  /*
    Visual representation of x-position calculation for non-stacked bars:

    |  <-------------- barWidth ---------------->
    |  |<-column->|   |<-column->|   |<-column->|
    |  |          |   |          |   |          |
    |  |          |   |          |   |          |
    |__|__________|___|__________|___|__________|___
       ^           ^   ^           ^
       |           |   |           |
       |           |   |           + (columnWidth * outerIdx)
       |           |   |
       |           |   + (gapBetweenColumns * (outerIdx + 1))
       |           |
       |           + (gapBetweenColumns)
       |
       + getXPosition(props.index)

    */
})

const yPos = computed(() => {
  if (props.stacked) {
    /*
     SVG Y axis is inverted and starts from the top
     -------------------------- y = 0
     |    ______
     |    |    |  getYPosition
     |    |____|
     |    |    |
     |    |____|  getPreviousHeight
     |    |    |
    */
    return (
      getYPosition(props.value) - getPreviousHeight(props.index, props.outerIdx)
    )
  }

  return getYPosition(props.value)
})
</script>

<template>
  <rect
    :key="renderKey"
    :x="xPos"
    :y="yPos"
    :data-idx="index"
    :data-value="value"
    :data-name="name"
    :width="columnWidth"
    :height="barHeight"
    :fill="color"
  >
    <AnimateSVG
      attributeName="height"
      :from="0"
      :to="barHeight"
      :delay="getAnimationDelay(index)"
    />
    <AnimateSVG
      attributeName="y"
      :from="startY"
      :to="yPos"
      :delay="getAnimationDelay(index)"
    />
  </rect>
</template>
