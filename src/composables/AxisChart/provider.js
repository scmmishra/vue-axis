import { inject, provide } from "vue";

export const AxisChartSymbol = Symbol("AxisChart");

export function useAxisChart() {
  const context = inject(AxisChartSymbol);

  if (context === null) {
    const err = new Error(
      `<${component} /> is missing a parent <TabContainer /> component.`,
    );
    if (Error.captureStackTrace) Error.captureStackTrace(err, useAxisChart);
    throw err;
  }

  return context;
}

export function provideAxisChart(payload) {
  return provide(AxisChartSymbol, payload);
}
