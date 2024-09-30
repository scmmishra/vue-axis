import { inject, provide, InjectionKey } from "vue";

export const AxisChartSymbol: InjectionKey<unknown> = Symbol("AxisChart");

export function useAxisChart<T>(): T {
  const context = inject<T | null>(AxisChartSymbol);

  if (context === null) {
    const err = new Error(
      `Component is missing a parent <TabContainer /> component.`,
    );
    if (Error.captureStackTrace) Error.captureStackTrace(err, useAxisChart);
    throw err;
  }

  return context as T;
}

export function provideAxisChart<T>(payload: T): void {
  provide(AxisChartSymbol, payload);
}
