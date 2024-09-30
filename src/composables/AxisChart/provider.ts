import { inject, provide } from "vue";
import type { InjectionKey, Ref, ComputedRef } from "vue";

export interface AxisChartPayload {
  yOffset: number;
  xOffset: number;
  dataset: {
    values: number[];
    name: string;
    color: string;
  }[];
  animationDuration: number;
  disableAnimation: boolean;
  stacked: boolean;
  spaceRatio: number;
  hoverIndex: Ref<number>;
  getAnimationDelay: (index: number) => number;
  leftmargin: number;
  containerWidth: Ref<number, number>;
  containerHeight: Ref<number, number>;
  barWidth: ComputedRef<number>;
  barGap: ComputedRef<number>;
  getHeight: (value: number) => number;
  getYPosition: (value: number) => number;
  getXPosition: (index: number) => number;
  drawWidth: ComputedRef<number>;
  maxValue: ComputedRef<number>;
  ticks: ComputedRef<number[]>;
  maxEffectiveValue: ComputedRef<number>;
}

export const AxisChartControl = Symbol(
  "AxisChart",
) as InjectionKey<AxisChartPayload>;

export function useAxisChart() {
  const context = inject(AxisChartControl, null);

  if (context === null) {
    throw new Error(`Component is missing a parent <AxisChart /> component.`);
  }

  return context;
}

export function provideAxisChart(payload: AxisChartPayload): void {
  provide(AxisChartControl, payload);
}
