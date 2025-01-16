import type { Ref } from 'vue'
import { useElementBounding, useParentElement } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'

const leftmargin = 50

interface Props {
  maxWidth: number
  height?: number
  yOffset: number
  xOffset: number
  labels: any[]
  spaceRatio: number
}

export default function useGeometry(props: Props, maxValue: Ref<number>) {
  const parent = useParentElement()
  const { width: parentWidth, height: parentHeight }
    = useElementBounding(parent)

  const containerWidth = ref<number>(0)
  const containerHeight = ref<number>(0)

  const computeGeometry = () => {
    containerWidth.value = Math.max(
      Math.min(parentWidth.value, props.maxWidth),
      0,
    )
    containerHeight.value
      = props.height ?? Math.round(containerWidth.value / 2.6)
  }

  watch(() => props.maxWidth, computeGeometry)
  watch(() => props.height, computeGeometry)
  watch(() => props.labels, computeGeometry)

  const yScale = computed(() => {
    return (containerHeight.value - 2 * props.yOffset) / maxValue.value
  })

  /*
  Container Width and Draw Width Diagram:

  |<---------------------- containerWidth ----------------------->|
  |                                                               |
  | leftmargin |<------------------ drawWidth ----------------->| |
  | this is    |                                                | |
  | where      |<-xOffset->|                        |<-xOffset->| |
  | ticks go   |           |                        |           | |
  |            |           |<-- actual draw area -->|           | |
  |            |           |                        |           | |
  */

  const drawWidth = computed(() => {
    const widthWithoutMargin = containerWidth.value - leftmargin
    return widthWithoutMargin - 2 * props.xOffset
  })

  const barWidth = computed(() => {
    const xScale = drawWidth.value / props.labels.length
    return xScale * (1 - props.spaceRatio)
  })

  const barGap = computed(() => {
    const xScale = drawWidth.value / props.labels.length
    return xScale * props.spaceRatio
  })

  /*
   Bar Width and Gap Diagram:

   |<-------- xScale -------->|
   |                          |
   |<-- barWidth -->|<- gap ->|
   |                |         |
   |     █████████  |         |
   |     █████████  |         |
   |     █████████  |         |
   |     █████████  |         |
   |     █████████  |         |
   |________________|_________|
   */

  function getHeight(value: number): number {
    return value * yScale.value
  }

  function getYPosition(value: number): number {
    return containerHeight.value - getHeight(value) - props.yOffset
  }

  function getXPosition(index: number): number {
    if (index === 0) {
      // shift this by barGap / 2 to align the gap halfway on each side of the bar
      return leftmargin + props.xOffset + barGap.value / 2
    }

    const effectiveBarWidth = barWidth.value + barGap.value
    // shift this by barGap / 2 to align the gap halfway on each side of the bar
    return (
      index * effectiveBarWidth + props.xOffset + leftmargin + barGap.value / 2
    )
  }

  onMounted(computeGeometry)

  return {
    leftmargin,
    containerWidth,
    barWidth,
    barGap,
    containerHeight,
    parentWidth,
    parentHeight,
    getHeight,
    drawWidth,
    getYPosition,
    getXPosition,
  }
}
